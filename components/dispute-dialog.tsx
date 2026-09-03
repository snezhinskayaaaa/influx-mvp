"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DisputeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { category: string; comment: string }) => Promise<void>
  categories: { value: string; label: string }[]
  title?: string
  description?: string
}

const DEFAULT_TITLE = "Open Dispute"
const DEFAULT_DESCRIPTION = "Describe the issue. An admin will review and make a decision."

export function DisputeDialog({
  open,
  onOpenChange,
  onSubmit,
  categories,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: DisputeDialogProps) {
  const [category, setCategory] = useState("")
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!category || !comment.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({ category, comment: comment.trim() })
      setCategory("")
      setComment("")
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-sm font-medium mb-2 block">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Description</Label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Describe the issue in detail..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={!category || !comment.trim() || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Submitting..." : "Submit Dispute"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
