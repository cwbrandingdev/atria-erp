"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { kanbanService, timesheetService } from "@/services";
import type { KanbanColumn, KanbanTask, TimeLog } from "@/services/types";
import { AddColumnDialog } from "./add-column-dialog";
import { ColumnHeader } from "./column-header";
import { CreateTaskDialog } from "./create-task-dialog";
import { TaskCard } from "./task-card";
import { TaskDetailDialog } from "./task-detail-dialog";

export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState<TimeLog | null>(null);

  const loadActiveTimer = useCallback(async () => {
    try {
      const timer = await timesheetService.getActiveTimer();
      setActiveTimer(timer);
    } catch {
      setActiveTimer(null);
    }
  }, []);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    try {
      const [cols, taskList] = await Promise.all([
        kanbanService.getColumns(),
        kanbanService.getTasks(),
      ]);
      setColumns(cols.sort((a, b) => a.order - b.order));
      setTasks(taskList);
      await loadActiveTimer();
    } catch {
      setColumns([]);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [loadActiveTimer]);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  function getColumnTasks(columnId: string) {
    return tasks
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.order - b.order);
  }

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newColumnId = destination.droppableId;
    const newOrder = destination.index;

    setTasks((prev) => {
      const movingTask = prev.find((task) => task.id === draggableId);
      if (!movingTask) return prev;

      const updated = prev.map((task) =>
        task.id === draggableId
          ? { ...task, columnId: newColumnId, order: newOrder }
          : task,
      );

      const columnTasks = updated
        .filter((task) => task.columnId === newColumnId)
        .sort((a, b) => a.order - b.order);

      const reordered = columnTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      return updated.map((task) => {
        const match = reordered.find((item) => item.id === task.id);
        return match ?? task;
      });
    });

    try {
      await kanbanService.moveTask(draggableId, newColumnId, newOrder);
      void loadBoard();
    } catch {
      void loadBoard();
    }
  }

  function openTaskDetail(task: KanbanTask) {
    setSelectedTask(task);
    setDetailOpen(true);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
            Kanban
          </h1>
          <p className="text-sm text-[var(--atria-primary)]/50">
            Gerencie tarefas e fluxo de produção
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AddColumnDialog onSuccess={() => void loadBoard()} />
          <CreateTaskDialog
            columns={columns}
            onSuccess={() => void loadBoard()}
          />
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--atria-primary)]/20 p-12 text-center">
            <p className="text-sm text-[var(--atria-primary)]/50">
              Carregando colunas do quadro...
            </p>
          </div>
        ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => {
            const columnTasks = getColumnTasks(column.id);

            return (
              <div
                key={column.id}
                className="flex w-72 shrink-0 flex-col"
              >
                <ColumnHeader
                  column={column}
                  taskCount={columnTasks.length}
                  onUpdate={() => void loadBoard()}
                />

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex min-h-[420px] flex-1 flex-col gap-3 rounded-b-2xl border border-t-0 p-3 transition-colors ${
                        snapshot.isDraggingOver
                          ? "border-[var(--atria-accent)] bg-[var(--atria-accent)]/10"
                          : "border-[var(--atria-primary)]/10 bg-[var(--atria-primary)]/[0.02]"
                      }`}
                      style={{
                        borderLeftColor: `${column.color}55`,
                        borderLeftWidth: 2,
                      }}
                    >
                      {columnTasks.length === 0 && (
                        <p className="py-8 text-center text-xs text-[var(--atria-primary)]/40">
                          Arraste tarefas para cá
                        </p>
                      )}

                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={
                                dragSnapshot.isDragging
                                  ? "rotate-1 opacity-90"
                                  : ""
                              }
                            >
                              <div
                                {...dragProvided.dragHandleProps}
                                className="mb-1 h-1.5 cursor-grab rounded-full bg-[var(--atria-primary)]/10 active:cursor-grabbing"
                              />
                              <TaskCard
                                task={task}
                                activeTimer={activeTimer}
                                onClick={() => openTaskDetail(task)}
                                onTimerUpdate={() => void loadBoard()}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
        )}
      </DragDropContext>

      <TaskDetailDialog
        task={selectedTask}
        columns={columns}
        open={detailOpen}
        activeTimer={activeTimer}
        onOpenChange={setDetailOpen}
        onUpdate={() => void loadBoard()}
      />
    </div>
  );
}
