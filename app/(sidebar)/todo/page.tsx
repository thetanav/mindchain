"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
} from "@/components/ui/kanban";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, CheckCircle2 } from "lucide-react";

interface TodoItem {
  id: string;
  content: string;
  createdAt: number;
}

type KanbanData = {
  todo: TodoItem[];
  doing: TodoItem[];
  planned: TodoItem[];
};

const STORAGE_KEY = "mindchain-todos";

export default function TodoPage() {
  const [kanbanData, setKanbanData] = useState<KanbanData>({
    todo: [],
    doing: [],
    planned: [],
  });
  const [newTodoText, setNewTodoText] = useState("");

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setKanbanData(parsed);
      } catch (error) {
        console.error("Failed to parse saved todos:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever kanbanData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kanbanData));
  }, [kanbanData]);

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      content: newTodoText.trim(),
      createdAt: Date.now(),
    };

    setKanbanData((prev) => ({
      ...prev,
      todo: [...prev.todo, newTodo],
    }));

    setNewTodoText("");
  };

  const handleDeleteTodo = (columnId: keyof KanbanData, todoId: string) => {
    setKanbanData((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((todo) => todo.id !== todoId),
    }));
  };

  const handleValueChange = (newData: Record<string, unknown[]>) => {
    setKanbanData(newData as KanbanData);
  };

  const getItemValue = (item: unknown) => {
    return (item as TodoItem).id;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const columnLabels = {
    todo: { label: "To Do", color: "bg-blue-500" },
    doing: { label: "Doing", color: "bg-yellow-500" },
    planned: { label: "Planned", color: "bg-purple-500" },
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight font-serif bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Todo Board
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Organize your tasks with this simple kanban board. Drag and drop to move tasks between columns.
          </p>
        </div>

        {/* Add new todo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 max-w-md mx-auto"
        >
          <Input
            placeholder="Add a new task..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTodo();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleAddTodo} disabled={!newTodoText.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </motion.div>

        {/* Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Kanban
            value={kanbanData}
            onValueChange={handleValueChange}
            getItemValue={getItemValue}
            orientation="horizontal"
            className="w-full"
          >
            <KanbanBoard className="gap-6 min-h-[600px]">
              {(Object.keys(kanbanData) as Array<keyof KanbanData>).map((columnId, index) => (
                <motion.div
                  key={columnId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <KanbanColumn value={columnId} className="h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${columnLabels[columnId].color}`} />
                        <h3 className="font-semibold text-lg">{columnLabels[columnId].label}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {kanbanData[columnId].length}
                        </Badge>
                      </div>
                      <KanbanColumnHandle />
                    </div>

                    <div className="space-y-3 flex-1">
                      {kanbanData[columnId].map((todo) => (
                        <KanbanItem key={todo.id} value={todo.id}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium break-words">
                                {todo.content}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(todo.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <KanbanItemHandle />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTodo(columnId, todo.id)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </KanbanItem>
                      ))}

                      {kanbanData[columnId].length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No tasks yet</p>
                        </div>
                      )}
                    </div>
                  </KanbanColumn>
                </motion.div>
              ))}
            </KanbanBoard>
          </Kanban>
        </motion.div>
      </motion.div>
    </div>
  );
}