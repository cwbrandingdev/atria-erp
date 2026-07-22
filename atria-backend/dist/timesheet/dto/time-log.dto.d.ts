export declare class StartTimerDto {
    taskId: string;
    notes?: string;
}
export declare class StopTimerDto {
    taskId: string;
}
export declare class CreateTimeLogDto {
    taskId: string;
    startTime: string;
    endTime: string;
    notes?: string;
}
export declare class QueryTimeLogsDto {
    taskId?: string;
    userId?: string;
    clientId?: string;
}
