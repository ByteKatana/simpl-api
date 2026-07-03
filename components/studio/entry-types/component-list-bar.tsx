import { Draggable, Droppable } from "@hello-pangea/dnd"
import { Card } from "@/components/ui/card"
import { Type, AlignLeft, CheckSquare, CircleDot, ChevronDown } from "lucide-react"

export const FORM_COMPONENTS = [
  { id: "input", label: "Text Input", icon: Type },
  { id: "textarea", label: "Textarea", icon: AlignLeft },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare },
  { id: "radio", label: "Radio Group", icon: CircleDot },
  { id: "select", label: "Select", icon: ChevronDown }
]

export const ComponentListBar = () => {
  return (
    <Droppable droppableId="COMPONENTS" isDropDisabled={true}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col gap-2 p-4 bg-muted/50 border rounded-lg w-64">
          <h3 className="font-semibold mb-2">Form Elements</h3>
          {FORM_COMPONENTS.map((comp, index) => (
            <Draggable key={comp.id} draggableId={comp.id} index={index}>
              {(provided, snapshot) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`p-3 flex items-center gap-3 cursor-grab hover:bg-accent transition-colors ${
                    snapshot.isDragging ? "ring-2 ring-primary" : ""
                  }`}>
                  <comp.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{comp.label}</span>
                </Card>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
