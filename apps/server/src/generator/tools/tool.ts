import path from 'path';
import fs, { readFileSync } from 'fs';
import { tool } from '@langchain/core/tools';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import chalk from 'chalk';
import { Runnable, RunnableLambda } from '@langchain/core/runnables';
import { objectStore } from '../../services/init';
import { tool_schema } from '../schema/tool_schema';
import { get_file_schema, get_template_file_schema } from '../schema/get_file_schema';
import { BaseMessage, ToolMessage } from '@langchain/core/messages';

const RULES_DIR = path.resolve(process.cwd(), 'dist/rules');

export default class Tool {
    /**
     * for fetching rule file from tool call
     */
    public static get_rule = tool(
        async ({ rule_name }: { rule_name: string }) => {
            console.log(chalk.red('tool called for rule: '), rule_name);

            const file_path = path.join(RULES_DIR, `${rule_name}.md`);

            console.log(chalk.yellow('requested rule name path: '), file_path);

            if (!fs.existsSync(file_path)) {
                console.log('rule file not found');
                return;
            }

            return readFileSync(file_path, 'utf-8');
        },
        {
            name: 'get_rule',
            description: 'fetches a rule document by name',
            schema: tool_schema,
        },
    );

    /**
     * for fetching contract file from cdn
     */
    public static get_file = tool(
        async ({ file_path, contract_id }: { file_path: string; contract_id: string }) => {
            const contract_files = await objectStore.get_resource_files(contract_id);
            const file = contract_files.find((f) => f.path === file_path);

            console.log('file requested: ', file_path);
            console.log('contract id sent: ', contract_id);

            if (!file) {
                console.error('file not found');
                return;
            }
            console.log('req file data: ', file.content);
            return file.content;
        },
        {
            name: 'get_file',
            description: "fetches a file content by it's path",
            schema: get_file_schema,
        },
    );

    public static get_template_file = tool(
        async ({ file_path, template_id }: { file_path: string; template_id: string }) => {
            const template_files = await objectStore.get_template_files(template_id);
            const file = template_files.find((f) => f.path === file_path);

            console.log('file requested: ', file_path);
            console.log('template id send: ', template_id);

            if (!file) {
                console.error('file not found');
                return;
            }
            return file.content;
        },
        {
            name: 'get_tempplate_file',
            description: "fetches a template file content by it's path",
            schema: get_template_file_schema,
        },
    );

    /**
     * creates a runnable-lambda that executes tool-calling by using specific paths
     */
    public static runner = new RunnableLambda({
        func: async (aiMessage: any) => {
            const toolCalls = aiMessage.tool_calls ?? aiMessage.tool_call_chunks ?? [];
            const results: Record<string, any>[] = [];

            for (const tc of toolCalls) {
                const toolImpl = Tool.TOOL_REGISTRY[tc.name];

                if (!toolImpl) {
                    throw new Error(`Unknown tool called: ${tc.name}`);
                }

                const args = typeof tc.args === 'string' ? JSON.parse(tc.args) : tc.args;

                const result = await toolImpl.invoke(args);

                results.push({
                    id: tc.id,
                    name: tc.name,
                    args,
                    result,
                });
            }

            return {
                aiMessage,
                toolResults: results,
            };
        },
    });

    public static convert = new RunnableLambda<{ toolResults: any[] }, { messages: BaseMessage[] }>(
        {
            func: ({ toolResults }: { toolResults: any }) => ({
                messages: toolResults.map(
                    (t: any) =>
                        new ToolMessage({
                            name: t.name,
                            tool_call_id: t.id,
                            content:
                                typeof t.result === 'string' ? t.result : JSON.stringify(t.result),
                        }),
                ),
            }),
        },
    );

    /**
     * finds all the rules file and remover their extension and return the name
     * @returns {string[]} containing rules name inside rules folder
     */
    public static get_rules_name(): string[] {
        const docs: string[] = [];

        const rules_dir = fs.readdirSync(RULES_DIR);

        if (!rules_dir) {
            console.log('rules dir not found');
            return [];
        }

        rules_dir.forEach((doc: string) => {
            docs.push(doc.split('.')[0]);
        });

        console.log({ docs });
        return docs;
    }

    public static node = new ToolNode([Tool.get_rule]);

    private static TOOL_REGISTRY: Record<string, Runnable> = {
        get_rule: Tool.get_rule,
        get_file: Tool.get_file,
    };
}
