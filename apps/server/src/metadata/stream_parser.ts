import { Message } from '@northfall/database';
import {
    ErrorData,
    FILE_STRUCTURE_TYPES,
    FileContent,
    PHASE_TYPES,
    STAGE,
    StreamEventData,
} from '@northfall/types';

export interface StreamEventPayload {
    data: StreamEventData;
    systemMessage: Message;
}

export abstract class StreamParserShape {
    protected buffer!: string;
    protected currentPhase!: string | null;
    protected currentStage!: string | null;
    protected currentFile!: string | null;
    protected currentCodeBlock!: string;
    protected insideCodeBlock!: boolean;
    protected isJsonBlock!: boolean;

    protected eventHandlers!: Map<
        PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        ((payload: StreamEventPayload) => void)[]
    >;

    protected generatedFiles!: FileContent[];
    protected pendingContext!: string | null;
    protected contractName!: string;

    protected pendingIdl!: string | null;
    protected generatedIdl!: Object[] | null;

    constructor() {}

    /**
     * @param {PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE} type
     * @param {(payload: StreamEventPayload) => void} callback
     * @returns void
     */
    public abstract on(
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        callback: (payload: StreamEventPayload) => void,
    ): void;

    /**
     * @param {PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE} type
     * @param {StreamEventData} data
     * @param {Message} systemMessage
     * @returns void
     */
    protected abstract emit(
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        data: StreamEventData,
        systemMessage: Message,
    ): void;

    /**
     * @param {string} chunk
     * @param {Message} systemMessage
     * @returns void
     */
    public abstract feed(chunk: string, systemMessage: Message): void;

    /**
     * @param {Message} systemMessage
     * @returns Promise<void>
     */
    protected abstract processBuffer(systemMessage: Message): Promise<void>;

    /**
     * @param {Messsage} systemMessage
     * @returns Promise<boolean>
     */
    protected abstract handleContext(systemMessage: Message): Promise<boolean>;

    /**
     * @param {string} stage
     * @param {Message} systemMessage
     * @returns Promise<void>
     */
    protected abstract stageMatch(stage: string, systemMessage: Message): Promise<void>;

    /**
     * @param {string} phase
     * @param {Message} systemMessage
     * @returns Promise<void>
     */
    protected abstract phaseMatch(phase: string, systemMessage: Message): Promise<void>;

    /**
     * @param {Message} systemMessage
     * @returns Promise<boolean>
     */
    protected abstract handleIdl(systemMessage: Message): Promise<boolean>;

    /**
     * @returns FileContent[]
     */
    public abstract getGeneratedFiles(): FileContent[];

    /**
     * @returns string
     */
    public abstract getContractName(): string;

    /**
     * @returns Object[] | null
     */
    public abstract getGeneratedIdl(): Object[] | null;

    /**
     * @returns void
     */
    public abstract reset(): void;

    /**
     * @param {Error} err
     * @param {ErrorData} errorData
     * @returns void
     */
    public abstract handleError(err: Error, errorData?: ErrorData): void;
}
