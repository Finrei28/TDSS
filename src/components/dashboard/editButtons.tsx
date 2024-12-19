import React from "react"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"

type EditButtonsProps = {
  edit: boolean
  handleSave: () => void
  setEdit: (boolean: boolean) => void
  handleEdit: (field: string) => void
  name: string
  editName: string
  saving: boolean
  handleCancel?: () => void
  newPlayer?: boolean
  handleDelete: () => void
  componentName: string
  deleting: boolean
}

const EditButtons = ({
  edit,
  handleSave,
  setEdit,
  handleEdit,
  name,
  editName,
  saving,
  handleCancel,
  newPlayer,
  handleDelete,
  componentName,
  deleting,
}: EditButtonsProps) => {
  return (
    <div className="flex justify-end">
      {edit && editName === name ? (
        <div
          className={`flex items-center ${
            componentName === "playerSteps" && !newPlayer
              ? "justify-between"
              : "justify-end"
          } w-full`}
        >
          {/* Delete Button aligned to the far left */}
          {componentName === "playerSteps" && !newPlayer && (
            <>
              {deleting ? (
                <Button
                  disabled
                  variant="destructive"
                  className="w-20 flex justify-center items-center"
                >
                  <Loader2 className="animate-spin h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="w-20"
                >
                  Delete
                </Button>
              )}
            </>
          )}

          {/* Save and Cancel Buttons grouped on the right */}
          <div className="flex space-x-3 justify-end items-end">
            {saving ? (
              <Button
                disabled
                className="w-20 flex justify-center items-center"
              >
                <Loader2 className="animate-spin h-5 w-5" />
              </Button>
            ) : (
              <Button onClick={() => handleSave()} className="w-20">
                Save
              </Button>
            )}
            <Button
              onClick={() => {
                if (newPlayer && handleCancel) {
                  handleCancel() // Remove the newly added player
                } else {
                  setEdit(false) // Simply close the edit mode
                }
              }}
              className="w-20"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => handleEdit(name)}>Edit</Button>
      )}
    </div>
  )
}

export default EditButtons
