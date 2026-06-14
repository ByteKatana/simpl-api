import React from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Card } from "@/components/ui/card"
import { Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DropZoneRowProps {
  onEdit: (rowId: string, instanceId: string) => void
  rowId: string
  items: any[]
  onRemove: (rowId: string, index: number) => void
  onRemoveRow: (rowId: string) => void
}

export const DropZoneRow = ({ rowId, items, onRemove, onRemoveRow, onEdit }: DropZoneRowProps) => {
  return (
    <Droppable droppableId={rowId} direction="vertical" isCombineEnabled={true}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`flex flex-col gap-4 p-4 min-h-[100px] border-2 border-dashed rounded-xl transition-colors relative group/row ${
            snapshot.isDraggingOver
              ? "bg-neutral-200/50 border-neutral-200"
              : "bg-neutral-50 border-muted dark:bg-neutral-800/50"
          }`}>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity z-10"
            onClick={() => onRemoveRow(rowId)}>
            <X className="h-3 w-3" />
          </Button>
          <div className="flex flex-col gap-4 ">
            {items
              .reduce((acc: any[], item: any, index: number) => {
                // Check if the previous item points to this item
                const prevItem = index > 0 ? items[index - 1] : null
                const isCombinedWithPrevious = prevItem && prevItem.nextFieldId === item.instanceId

                if (isCombinedWithPrevious) {
                  const last = acc[acc.length - 1]
                  if (Array.isArray(last)) {
                    last.push({ item, originalIndex: index })
                  } else {
                    acc[acc.length - 1] = [last, { item, originalIndex: index }]
                  }
                } else {
                  acc.push({ item, originalIndex: index })
                }
                return acc
              }, [])
              .map((group, groupIndex) => (
                <div key={groupIndex} className={`flex ${Array.isArray(group) ? "flex-row gap-4" : "flex-col"} w-full`}>
                  {Array.isArray(group) ? (
                    group.map(({ item, originalIndex }) => (
                      <Draggable key={item.instanceId} draggableId={item.instanceId} index={originalIndex}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="w-full relative group">
                            <Card className="h-full p-4 flex items-center justify-center bg-card">
                              <span className="text-xs font-mono uppercase text-muted-foreground">
                                {item.name || item.type}
                              </span>
                            </Card>
                            <Button
                              type="button"
                              id="edit-button"
                              variant="default"
                              size="icon"
                              className="absolute -top-2 right-5 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 hover:bg-amber-600"
                              onClick={() => onEdit(rowId, item.instanceId)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onRemove(rowId, originalIndex)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <Draggable
                      key={group.item.instanceId}
                      draggableId={group.item.instanceId}
                      index={group.originalIndex}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="w-full relative group">
                          <Card className="h-full p-4 flex items-center justify-center bg-card">
                            <span className="text-xs font-mono uppercase text-muted-foreground">
                              {group.item.name || group.item.type}
                            </span>
                          </Card>
                          <Button
                            type="button"
                            id="edit-button"
                            variant="default"
                            size="icon"
                            className="absolute -top-2 right-5 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 hover:bg-amber-600"
                            onClick={() => onEdit(rowId, group.item.instanceId)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onRemove(rowId, group.originalIndex)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  )}
                </div>
              ))}
          </div>
          <div className="flex items-center justify-center text-muted-foreground text-sm italic">
            {items.length === 0 ? "Drop here" : "Add more components"}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
