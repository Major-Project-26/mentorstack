# Edit/Delete UI Guide

## Question Edit/Delete Buttons

### Location
The edit and delete buttons appear in the top-right corner of the question, next to the bookmark button, but **only for the question author**.

### Visual Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Question Title                        [📌] [✏️] [🗑️]       │
│  Asked by John Doe • October 26, 2025                        │
├─────────────────────────────────────────────────────────────┤
│  Question body content here...                               │
│                                                              │
│  [tag1] [tag2] [tag3]                                       │
└─────────────────────────────────────────────────────────────┘

Legend:
📌 = Bookmark (visible to all)
✏️ = Edit (visible only to author)
🗑️ = Delete (visible only to author)
```

### Edit Mode
When clicking the edit button, the question transforms into an editable form:

```
┌─────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Question Title (editable)                             │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Question body (editable textarea)                     │  │
│  │                                                        │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  [💾 Save Changes]  [❌ Cancel]                             │
└─────────────────────────────────────────────────────────────┘
```

## Answer Edit/Delete Buttons

### Location
The edit and delete buttons appear in the top-right of each answer, next to the author info, but **only for the answer author**.

### Visual Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ⬆️  │  Answered by Jane Smith • Oct 26, 2025    [✏️] [🗑️]  │
│ 15 │                                                         │
│ ⬇️  │  Answer content goes here...                          │
│    │                                                         │
└─────────────────────────────────────────────────────────────┘

Legend:
⬆️ = Upvote
⬇️ = Downvote
15 = Vote score
✏️ = Edit (visible only to author)
🗑️ = Delete (visible only to author)
```

### Edit Mode
When clicking the edit button, the answer content becomes a textarea:

```
┌─────────────────────────────────────────────────────────────┐
│ ⬆️  │  ┌────────────────────────────────────────────────┐  │
│ 15 │  │ Answer content (editable textarea)             │  │
│ ⬇️  │  │                                                │  │
│    │  │                                                │  │
│    │  └────────────────────────────────────────────────┘  │
│    │                                                        │
│    │  [💾 Save Changes]  [❌ Cancel]                       │
└─────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Buttons
- **Edit Button (Pencil Icon)**: Blue color scheme
  - Normal: `text-blue-600`
  - Hover: `hover:bg-blue-50`
  
- **Delete Button (Trash Icon)**: Red color scheme
  - Normal: `text-red-600`
  - Hover: `hover:bg-red-50`

- **Save Button**: Blue filled button
  - Background: `bg-blue-600`
  - Text: `text-white`
  - Hover: `hover:bg-blue-700`
  - Disabled: `bg-gray-300`

- **Cancel Button**: Gray filled button
  - Background: `bg-gray-200`
  - Text: `text-gray-700`
  - Hover: `hover:bg-gray-300`

## Icon Sizes

### Question Buttons
- Edit/Delete icons: `20px` (size={20})
- Positioned with padding: `p-2`

### Answer Buttons
- Edit/Delete icons: `16px` (size={16}) - slightly smaller
- Positioned with padding: `p-1`

## User Interactions

### Editing Flow
1. **Click Edit** → Switches to edit mode
2. **Make Changes** → Text becomes editable
3. **Click Save** → Saves and returns to view mode
4. **Click Cancel** → Discards changes and returns to view mode

### Deleting Flow
1. **Click Delete** → Shows browser confirmation dialog
2. **Confirm** → Deletes and updates the view
3. **Cancel** → Nothing happens, stays on page

### Validation
- Question title: Minimum 10 characters
- Question body: Minimum 20 characters
- Answer content: Minimum 20 characters
- Save button is disabled until validation passes

## Authorization

### Who Can See Edit/Delete Buttons?
- **Question author** can see edit/delete on their question
- **Answer author** can see edit/delete on their answer
- **Other users** see no edit/delete buttons
- **Non-logged-in users** see no edit/delete buttons

### How It Works
```javascript
// Only show if current user is the author
{currentUserId && question.authorId === currentUserId && (
  <div className="flex gap-2">
    <button onClick={handleEditQuestion}>Edit</button>
    <button onClick={handleDeleteQuestion}>Delete</button>
  </div>
)}
```

## Error Handling

### Frontend Alerts
- Failed edit: "Failed to update question/answer. Please try again."
- Failed delete: "Failed to delete question/answer. Please try again."

### Confirmation Dialogs
- Delete question: "Are you sure you want to delete this question? This action cannot be undone."
- Delete answer: "Are you sure you want to delete this answer? This action cannot be undone."

## Responsive Design

All buttons maintain their layout on mobile devices:
- Icons remain visible and clickable
- Buttons stack vertically on very small screens
- Edit mode forms are full-width and responsive

## Accessibility

- All buttons have `title` attributes for tooltips
- Buttons have proper `aria-label` (implicitly via icons)
- Disabled states are clearly indicated
- Focus states are visible
- Color contrast meets WCAG standards
