import { ChatRole, Message, prisma } from '@northfall/database';
import { FileContent } from '../types/content_types';
import chalk from 'chalk';

export default class AgentStreamParser {
    private buffer: string;
    private currentFile: string | null;
    private currentCodeBlock: string;
    private insideCodeBlock: boolean;
    private generatedFiles: FileContent[];
    private contractName: string;
    private context: string;

    constructor() {
        this.buffer = '';
        this.currentFile = null;
        this.currentCodeBlock = '';
        this.insideCodeBlock = false;
        this.generatedFiles = [];
        this.contractName = '';
        this.context = '';
    }

    public feed(chunk: string, systemMessage: Message): void {
        this.buffer += chunk;
        this.processBuffer(systemMessage);
    }

    private async processBuffer(systemMessage: Message): Promise<void> {
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();

            // Skip empty lines when not in code block
            if (!trimmed && !this.insideCodeBlock) continue;

            // Handle NAME (supports both **NAME:** and NAME:)
            const nameMatch = trimmed.match(/^\*?\*?NAME\*?\*?:\s*(.+)$/i);
            if (nameMatch && !this.insideCodeBlock) {
                this.contractName = nameMatch[1].trim();
                console.log(chalk.cyan('Contract Name:'), this.contractName);
                continue;
            }

            // Handle CONTEXT
            const contextMatch = trimmed.match(/^\*?\*?CONTEXT\*?\*?:\s*(.+)$/i);
            if (contextMatch && !this.insideCodeBlock) {
                this.context = contextMatch[1].trim();
                console.log(chalk.red('Context:'), this.context);

                // Save context to database
                try {
                    await prisma.message.create({
                        data: {
                            content: this.context,
                            contractId: systemMessage.contractId,
                            role: ChatRole.AI,
                        },
                    });
                } catch (error) {
                    console.error('Failed to save context:', error);
                }
                continue;
            }

            // Handle STAGE
            const stageMatch = trimmed.match(/^\*?\*?STAGE\*?\*?:\s*(.+)$/i);
            if (stageMatch && !this.insideCodeBlock) {
                const stage = stageMatch[1].trim();
                console.log(chalk.green('Stage:'), stage);
                continue;
            }

            // Handle PHASE
            const phaseMatch = trimmed.match(/^\*?\*?PHASE\*?\*?:\s*(.+)$/i);
            if (phaseMatch && !this.insideCodeBlock) {
                const phase = phaseMatch[1].trim();
                console.log(chalk.yellow('Phase:'), phase);
                continue;
            }

            // Handle FILE
            const fileMatch = trimmed.match(/^\*?\*?FILE\*?\*?:\s*(.+)$/i);
            if (fileMatch && !this.insideCodeBlock) {
                this.currentFile = fileMatch[1].trim();
                console.log(chalk.magenta('File:'), this.currentFile);
                continue;
            }

            // Handle code blocks
            if (trimmed.startsWith('```')) {
                if (this.insideCodeBlock) {
                    // Closing code block
                    if (this.currentFile) {
                        const content = this.currentCodeBlock.trimEnd();
                        this.generatedFiles.push({
                            path: this.currentFile,
                            content: content,
                        });
                        console.log(
                            chalk.blue(`✓ Saved: ${this.currentFile} (${content.length} chars)`),
                        );
                    }
                    this.insideCodeBlock = false;
                    this.currentCodeBlock = '';
                    this.currentFile = null; // Reset file after saving
                } else {
                    // Opening code block
                    this.insideCodeBlock = true;
                    this.currentCodeBlock = '';
                }
                continue;
            }

            // Accumulate code inside code blocks
            if (this.insideCodeBlock) {
                this.currentCodeBlock += line + '\n';
                continue;
            }
        }
    }

    public getGeneratedFiles(): FileContent[] {
        return this.generatedFiles;
    }

    public getContractName(): string {
        return this.contractName;
    }

    public getContext(): string {
        return this.context;
    }

    public reset(): void {
        this.buffer = '';
        this.currentFile = null;
        this.currentCodeBlock = '';
        this.insideCodeBlock = false;
        this.generatedFiles = [];
        this.contractName = '';
        this.context = '';
    }

    public getStats(): {
        filesGenerated: number;
        totalLines: number;
        totalCharacters: number;
    } {
        const totalLines = this.generatedFiles.reduce(
            (sum, file) => sum + file.content.split('\n').length,
            0,
        );
        const totalCharacters = this.generatedFiles.reduce(
            (sum, file) => sum + file.content.length,
            0,
        );

        return {
            filesGenerated: this.generatedFiles.length,
            totalLines,
            totalCharacters,
        };
    }
}
