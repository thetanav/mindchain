"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { composeRefs, useComposedRefs } from "@/lib/compose-refs"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { GripVertical, Plus } from "lucide-react"

const KanbanContext = React.createContext<{
  value: Record<string, unknown[]>
  onValueChange?: (value: Record<string, unknown[]>) => void
  getItemValue?: (item: unknown) => string | number
  orientation: "vertical" | "horizontal"
  activeId: string | null
  setActiveId: (id: string | null) => void
  activeColumn: string | null
  setActiveColumn: (column: string | null) => void
  activeItem: unknown | null
  setActiveItem: (item: unknown | null) => void
  itemListeners: any
  setItemListeners: (listeners: any) => void
} | null>(null)

function useKanban() {
  const context = React.useContext(KanbanContext)
  if (!context) {
    throw new Error("useKanban must be used within a Kanban component")
  }
  return context
}

interface KanbanProps extends React.HTMLAttributes<HTMLDivElement> {
  value: Record<string, unknown[]>
  onValueChange?: (value: Record<string, unknown[]>) => void
  getItemValue?: (item: unknown) => string | number
  orientation?: "vertical" | "horizontal"
  children: React.ReactNode
}

const Kanban = React.forwardRef<HTMLDivElement, KanbanProps>(
  (
    {
      value,
      onValueChange,
      getItemValue,
      orientation = "vertical",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [activeId, setActiveId] = React.useState<string | null>(null)
    const [activeColumn, setActiveColumn] = React.useState<string | null>(null)
    const [activeItem, setActiveItem] = React.useState<unknown | null>(null)
    const [itemListeners, setItemListeners] = React.useState<any>(null)

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      }),
      useSensor(KeyboardSensor)
    )

    const findColumn = (id: string) => {
      for (const [columnId, items] of Object.entries(value)) {
        if (columnId === id) return { columnId, items: [] }
        const item = items.find((item) => getItemValue?.(item) === id)
        if (item) return { columnId, items }
      }
      return null
    }

    const handleDragStart = (event: DragStartEvent) => {
      const { active } = event
      setActiveId(active.id as string)

      const column = findColumn(active.id as string)
      if (column) {
        if (column.items.length === 0) {
          // Dragging a column
          setActiveColumn(column.columnId)
          setActiveItem(null)
        } else {
          // Dragging an item
          const item = column.items.find((item) => getItemValue?.(item) === active.id)
          setActiveColumn(null)
          setActiveItem(item || null)
        }
      }
    }

    const handleDragOver = (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) return

      const activeId = active.id as string
      const overId = over.id as string

      const activeColumn = findColumn(activeId)
      const overColumn = findColumn(overId)

      if (!activeColumn || !overColumn) return

      // Don't do anything if we're over the same column
      if (activeColumn.columnId === overColumn.columnId) return

      // Only allow items to be moved between columns, not columns themselves
      if (activeColumn.items.length > 0 && overColumn.items.length >= 0) {
        const newValue = { ...value }
        const activeItems = newValue[activeColumn.columnId]
        const overItems = newValue[overColumn.columnId]

        const activeIndex = activeItems.findIndex(
          (item) => getItemValue?.(item) === activeId
        )
        const overIndex = overItems.findIndex(
          (item) => getItemValue?.(item) === overId
        )

        if (activeIndex !== -1) {
          const [removed] = activeItems.splice(activeIndex, 1)
          if (overIndex !== -1) {
            overItems.splice(overIndex, 0, removed)
          } else {
            overItems.push(removed)
          }
          onValueChange?.(newValue)
        }
      }
    }

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event
      if (!over) {
        setActiveId(null)
        setActiveColumn(null)
        setActiveItem(null)
        return
      }

      const activeId = active.id as string
      const overId = over.id as string

      const activeColumn = findColumn(activeId)
      const overColumn = findColumn(overId)

      if (!activeColumn || !overColumn) {
        setActiveId(null)
        setActiveColumn(null)
        setActiveItem(null)
        return
      }

      // If we're dropping an item within the same column
      if (activeColumn.columnId === overColumn.columnId && activeColumn.items.length > 0) {
        const newValue = { ...value }
        const items = newValue[activeColumn.columnId]

        const activeIndex = items.findIndex(
          (item) => getItemValue?.(item) === activeId
        )
        const overIndex = items.findIndex(
          (item) => getItemValue?.(item) === overId
        )

        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
          const [removed] = items.splice(activeIndex, 1)
          items.splice(overIndex, 0, removed)
          onValueChange?.(newValue)
        }
      }

      setActiveId(null)
      setActiveColumn(null)
      setActiveItem(null)
    }

    return (
        <KanbanContext.Provider
          value={{
            value,
            onValueChange,
            getItemValue,
            orientation,
            activeId,
            setActiveId,
            activeColumn,
            setActiveColumn,
            activeItem,
            setActiveItem,
            itemListeners,
            setItemListeners,
          }}
        >
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div ref={ref} className={cn("", className)} {...props}>
            {children}
          </div>
        </DndContext>
      </KanbanContext.Provider>
    )
  }
)
Kanban.displayName = "Kanban"

const KanbanBoard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useKanban()

  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-4",
        orientation === "vertical" ? "flex-col" : "flex-row overflow-x-auto",
        className
      )}
      {...props}
    />
  )
})
KanbanBoard.displayName = "KanbanBoard"

interface KanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  ({ className, value, children, ...props }, ref) => {
    const {
      value: kanbanValue,
      onValueChange,
      getItemValue,
      orientation,
      activeId,
      activeColumn,
    } = useKanban()
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: value,
      data: {
        type: "column",
      },
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    const items = kanbanValue[value] || []

    return (
      <div
        ref={(node) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(node)
            } else {
              ref.current = node
            }
          }
          setNodeRef(node)
        }}
        style={style}
        className={cn(
          "flex flex-col bg-muted/50 rounded-lg border p-4 min-h-[200px]",
          orientation === "vertical" ? "flex-1" : "w-80 flex-shrink-0",
          isDragging && "opacity-50",
          activeColumn === value && "ring-2 ring-primary",
          className
        )}
        data-disabled={isDragging}
        data-dragging={isDragging}
        {...props}
      >
        <SortableContext
          items={[value, ...items.map((item) => getItemValue?.(item) || "")]}
          strategy={
            orientation === "vertical"
              ? verticalListSortingStrategy
              : horizontalListSortingStrategy
          }
        >
          {children}
        </SortableContext>
      </div>
    )
  }
)
KanbanColumn.displayName = "KanbanColumn"

const KanbanColumnHandle = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { activeColumn } = useKanban()
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: "column-handle",
    data: {
      type: "column",
    },
  })

  return (
    <Button
      ref={(node) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(node)
          } else {
            ref.current = node
          }
        }
        setNodeRef(node)
      }}
      variant="ghost"
      size="sm"
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "cursor-grabbing",
        activeColumn && "cursor-grabbing",
        className
      )}
      data-disabled={isDragging}
      data-dragging={isDragging}
      {...attributes}
      {...listeners}
      {...props}
    >
      <GripVertical className="h-4 w-4" />
    </Button>
  )
})
KanbanColumnHandle.displayName = "KanbanColumnHandle"

interface KanbanItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number
}

  const KanbanItem = React.forwardRef<HTMLDivElement, KanbanItemProps>(
    ({ className, value, children, ...props }, ref) => {
      const { activeId, activeItem, setItemListeners } = useKanban()
      const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
      } = useSortable({
        id: value,
        data: {
          type: "item",
        },
      })

      React.useEffect(() => {
        setItemListeners(listeners)
      }, [listeners, setItemListeners])

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div
        ref={(node) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(node)
            } else {
              ref.current = node
            }
          }
          setNodeRef(node)
        }}
        style={style}
        className={cn(
          "bg-background rounded-md border p-3 shadow-sm cursor-grab active:cursor-grabbing",
          isDragging && "opacity-50 shadow-lg rotate-2",
          activeId === value && "ring-2 ring-primary",
          className
        )}
        data-disabled={isDragging}
        data-dragging={isDragging}
        {...props}
      >
        {children}
      </div>
    )
  }
)
KanbanItem.displayName = "KanbanItem"

const KanbanItemHandle = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { itemListeners } = useKanban()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn(
        "cursor-grab active:cursor-grabbing h-6 w-6 p-0",
        className
      )}
      {...itemListeners}
      {...props}
    >
      <GripVertical className="h-3 w-3" />
    </Button>
  )
})
KanbanItemHandle.displayName = "KanbanItemHandle"

interface KanbanOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const KanbanOverlay = React.forwardRef<HTMLDivElement, KanbanOverlayProps>(
  ({ className, children, ...props }, ref) => {
    const { activeItem, activeColumn } = useKanban()

    if (!activeItem && !activeColumn) return null

    return createPortal(
      <DragOverlay>
        {activeItem ? (
          <div
            ref={ref}
            className={cn(
              "bg-background rounded-md border p-3 shadow-lg rotate-2",
              className
            )}
            {...props}
          >
            {children}
          </div>
        ) : (
          <div
            ref={ref}
            className={cn(
              "bg-muted/50 rounded-lg border p-4 min-h-[200px] shadow-lg",
              className
            )}
            {...props}
          >
            {children}
          </div>
        )}
      </DragOverlay>,
      document.body
    )
  }
)
KanbanOverlay.displayName = "KanbanOverlay"

export {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
}