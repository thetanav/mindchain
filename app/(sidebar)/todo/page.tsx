"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Circle, CircleCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TodoItem {
  id: string;
  content: string;
  createdAt: number;
}

type KanbanData = {
  todo: TodoItem[];
  inProgress: TodoItem[];
  done: TodoItem[];
};

const STORAGE_KEY = "mindchain-todos";

export default function TodoPage() {
  const [kanbanData, setKanbanData] = useState<KanbanData>({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [newTodoText, setNewTodoText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setKanbanData({
          todo: parsed.todo || [],
          inProgress: parsed.inProgress || parsed.doing || [],
          done: parsed.done || parsed.planned || [],
        });
      } catch {
        setKanbanData({ todo: [], inProgress: [], done: [] });
      }
    }
  }, []);

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

  const moveTodo = (from: keyof KanbanData, to: keyof KanbanData, todoId: string) => {
    const todo = kanbanData[from].find((t) => t.id === todoId);
    if (!todo) return;
    setKanbanData((prev) => ({
      ...prev,
      [from]: prev[from].filter((t) => t.id !== todoId),
      [to]: [...prev[to], todo],
    }));
  };

  const columnConfig = {
    todo: { title: "To Do", color: "border-l-blue-500" },
    inProgress: { title: "In Progress", color: "border-l-amber-500" },
    done: { title: "Done", color: "border-l-green-500" },
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif mb-2">Tasks</h1>
        <p className="text-muted-foreground">Stay organized and track your progress</p>
      </div>

      <div className="flex gap-3 mb-8">
        <Input
          placeholder="Add a new task..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          className="max-w-md"
        />
        <Button onClick={handleAddTodo} disabled={!newTodoText.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {(Object.keys(kanbanData) as Array<keyof typeof columnConfig>).map((columnId) => (
          <Card key={columnId} className={`border-l-4 ${columnConfig[columnId].color}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  {columnConfig[columnId].title}
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {kanbanData[columnId].length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {kanbanData[columnId].length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No tasks
                </p>
              ) : (
                kanbanData[columnId].map((todo) => (
                  <div
                    key={todo.id}
                    className="p-3 rounded-lg border bg-card group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm flex-1">{todo.content}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeleteTodo(columnId, todo.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {columnId !== "todo" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-6 text-xs"
                        onClick={() =>
                          columnId === "done"
                            ? moveTodo("done", "todo", todo.id)
                            : moveTodo("inProgress", "todo", todo.id)
                        }
                      >
                        <Circle className="h-3 w-3 mr-1" />
                        Move to To Do
                      </Button>
                    )}
                    {columnId !== "done" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 h-6 text-xs"
                        onClick={() =>
                          columnId === "todo"
                            ? moveTodo("todo", "inProgress", todo.id)
                            : moveTodo("inProgress", "done", todo.id)
                        }
                      >
                        <CircleCheck className="h-3 w-3 mr-1" />
                        {columnId === "todo" ? "Start" : "Complete"}
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
