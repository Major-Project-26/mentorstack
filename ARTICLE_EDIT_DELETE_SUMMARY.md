# Article Edit/Delete Feature Implementation

## Summary

Successfully implemented edit and delete functionality for articles in the MentorStack application, matching the pattern used for questions and answers.

## Backend Changes (`backend/src/routes/articles.ts`)

### New Endpoints Added

#### 1. Update Article - `PUT /api/articles/:id`
- **Authorization**: Only article author can update
- **Validation**:
  - Title: minimum 5 characters
  - Content: minimum 20 characters
- **Features**:
  - Update title and content
  - Update/add new images
  - Preserve existing images via `existingImageUrls` parameter
  - Update tags (removes old tags, adds new ones)
  - Returns updated article with all metadata
- **Security**: Returns 403 Forbidden if non-author attempts to edit

#### 2. Delete Article - `DELETE /api/articles/:id`
- **Authorization**: Only article author can delete
- **Features**:
  - Deletes article and all related data (cascade)
  - Automatically removes: votes, bookmarks, tags
- **Security**: Returns 403 Forbidden if non-author attempts to delete

### Modified Endpoints

Updated article list and detail endpoints to include `authorId` in response:
- `GET /api/articles` - Returns authorId for each article
- `GET /api/articles/:id` - Returns authorId in article details

## Frontend Changes

### 1. API Client (`frontend/src/lib/auth-api.ts`)

#### Updated Interface
```typescript
export interface Article {
  id: number;
  title: string;
  content: string;
  imageUrls: string[];
  authorId?: number;  // NEW - for authorization checks
  authorName: string;
  // ... other fields
}
```

#### New Methods
- `updateArticle(articleId, formData)` - Update an article
- `deleteArticle(articleId)` - Delete an article

### 2. Article Detail Page (`frontend/src/app/article/[id]/page.tsx`)

#### New State Variables
```typescript
const [currentUserId, setCurrentUserId] = useState<number | null>(null);
const [isEditing, setIsEditing] = useState(false);
const [editTitle, setEditTitle] = useState("");
const [editContent, setEditContent] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
```

#### New Features

**Edit Mode:**
- Full-page inline editor
- Edit title and content in-place
- Markdown support maintained
- Save/Cancel buttons
- Real-time validation

**Delete Confirmation:**
- Browser confirmation dialog
- Prevents accidental deletions
- Redirects to articles list after deletion

**Authorization:**
- Edit/Delete buttons only visible to article author
- Compares `currentUserId` with `article.authorId`
- Backend enforces authorization

## UI Components Added

### Edit/Delete Buttons
Located next to author info, only visible to article author:

```tsx
{currentUserId && article.authorId === currentUserId && !isEditing && (
  <div className="flex gap-2">
    <button onClick={handleEditArticle}>
      <Edit size={20} /> {/* Blue pencil icon */}
    </button>
    <button onClick={handleDeleteArticle}>
      <Trash2 size={20} /> {/* Red trash icon */}
    </button>
  </div>
)}
```

### Edit Mode UI
When editing, the article view transforms:
- Title becomes editable input field
- Content becomes large textarea (20 rows)
- "Save Changes" and "Cancel" buttons appear
- Vote buttons and other UI elements hidden during edit

## User Flow

### Editing an Article
1. **Author views their article** → Edit button appears (blue pencil icon)
2. **Click Edit** → Title and content become editable
3. **Make changes** → Type in title/content fields
4. **Click "Save Changes"** → Article updates, returns to view mode
5. **OR Click "Cancel"** → Discards changes, returns to view mode

### Deleting an Article
1. **Author views their article** → Delete button appears (red trash icon)
2. **Click Delete** → Confirmation dialog appears
3. **Confirm deletion** → Article deleted, redirected to articles list
4. **OR Cancel** → No action taken

## Security Features

### Frontend
- Buttons only visible to content authors
- Uses `currentUserId === article.authorId` check
- Form validation before submission

### Backend
- JWT token verification on all protected routes
- Author ownership verification
- Returns appropriate HTTP status codes:
  - 400: Validation errors
  - 403: Authorization errors
  - 404: Article not found
  - 500: Server errors

## Validation Rules

### Title
- Minimum: 5 characters
- Required field
- Trimmed before saving

### Content
- Minimum: 20 characters
- Required field
- Trimmed before saving
- Markdown formatting preserved

## Database Schema Support

The existing Prisma schema fully supports these operations:
- `authorId` field in Article model
- Cascade delete configured via `onDelete: Cascade`
- Author relation via `@relation` directive

## Icons Used (lucide-react)

- `Edit` - Edit button (blue)
- `Trash2` - Delete button (red)
- `Save` - Save changes button
- `XCircle` - Cancel button

## Color Scheme

- **Edit Button**: Blue (`text-blue-600`, `hover:bg-blue-50`)
- **Delete Button**: Red (`text-red-600`, `hover:bg-red-50`)
- **Save Button**: Blue filled (`bg-blue-600`, `hover:bg-blue-700`)
- **Cancel Button**: Gray filled (`bg-gray-200`, `hover:bg-gray-300`)

## Error Handling

### Frontend
- Shows browser alerts on API errors
- Prevents multiple submissions with loading states
- Validates input before submission
- Disables buttons during submission

### Backend
- Comprehensive error logging
- Detailed error messages in development mode
- Generic error messages in production

## Image Handling

When editing articles:
- Existing images preserved via `existingImageUrls` parameter
- New images can be uploaded (up to 5 images)
- Images appended to existing image array
- No image deletion in current implementation

## Testing Checklist

- [x] Article author can edit their article
- [x] Article author can delete their article
- [x] Non-authors cannot see edit/delete buttons
- [x] Backend rejects unauthorized edit attempts (403)
- [x] Backend rejects unauthorized delete attempts (403)
- [x] Validation works correctly (title 5+, content 20+ chars)
- [x] Confirmation dialog appears before deletion
- [x] UI updates after successful operations
- [x] Error messages display properly
- [x] Redirect works after deletion
- [x] Cancel button discards changes
- [x] Markdown rendering preserved after edit

## Comparison with Questions/Answers

| Feature | Questions/Answers | Articles |
|---------|------------------|----------|
| Edit inline | ✅ Yes | ✅ Yes |
| Delete with confirmation | ✅ Yes | ✅ Yes |
| Author-only access | ✅ Yes | ✅ Yes |
| Backend validation | ✅ Yes | ✅ Yes |
| Tag support | ✅ Yes | ✅ Yes |
| Image support | ❌ No | ✅ Yes |
| Rich text editor | ✅ Yes | 📝 Textarea |

## Future Enhancements

1. **Rich Text Editor**
   - WYSIWYG editor for better UX
   - Live markdown preview

2. **Image Management**
   - Remove individual images during edit
   - Reorder images
   - Image upload during edit

3. **Version History**
   - Track edit timestamps
   - Show "edited" indicator
   - View revision history

4. **Draft System**
   - Auto-save drafts
   - Recover unsaved changes

5. **Collaborative Editing**
   - Allow co-authors
   - Track multiple contributors

## Files Modified

### Backend
- `backend/src/routes/articles.ts` - Added PUT and DELETE routes

### Frontend
- `frontend/src/lib/auth-api.ts` - Added updateArticle and deleteArticle methods
- `frontend/src/app/article/[id]/page.tsx` - Added edit/delete UI and handlers

## API Endpoints Summary

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|--------------|---------|
| GET | `/api/articles` | No | List all articles (includes authorId) |
| GET | `/api/articles/:id` | No | Get article details (includes authorId) |
| POST | `/api/articles` | Yes | Create new article |
| PUT | `/api/articles/:id` | Yes (Author) | Update article |
| DELETE | `/api/articles/:id` | Yes (Author) | Delete article |
| POST | `/api/articles/:id/vote` | Yes | Vote on article |

## Conclusion

The article edit/delete feature is now fully implemented and matches the functionality provided for questions and answers. The implementation follows the same security patterns, validation rules, and user experience conventions used throughout the application.
