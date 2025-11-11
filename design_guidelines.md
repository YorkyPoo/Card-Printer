# Design Guidelines: Card Printer Web Application

## Design Approach
**Design System**: Material Design (Google)
**Rationale**: This is a utility-focused productivity tool requiring clear workflows, intuitive file handling, and efficient card management. Material Design provides excellent patterns for data display, file uploads, and grid-based layouts.

## Core Design Principles
1. **Clarity First**: Every action should be immediately obvious
2. **Workflow Efficiency**: Minimize steps from upload to print
3. **Visual Feedback**: Clear states for upload, processing, and print-ready
4. **Spatial Organization**: Clean separation between upload, preview, and control areas

## Layout System
**Spacing**: Use Tailwind units of 2, 4, 6, and 8 for consistent rhythm (p-4, m-6, gap-8)
**Container**: max-w-7xl centered with px-6 padding
**Grid Structure**: 
- Upload area: Full width, prominent placement
- Card preview: 3-column grid (matching print layout) on desktop, responsive down to 1-column mobile
- Controls: Fixed bottom bar or sidebar for print/export actions

## Typography
**Font**: Inter (via Google Fonts CDN)
- Headings: 700 weight, text-2xl to text-3xl
- Body/Labels: 400 weight, text-base
- Buttons/Actions: 600 weight, text-sm to text-base
- Card counts/metadata: 500 weight, text-sm

## Component Library

### Upload Interface
- Large drag-and-drop zone with dashed border and icon
- Clear "Upload PNG/Files" instruction text
- File input button as secondary option
- Visual feedback during drag-over state
- Upload progress indicators

### Card Grid Preview
- 3-column grid matching print layout (grid-cols-3)
- Each card preview: 
  - Aspect ratio matching 63mm x 88mm (roughly 5:7)
  - Border showing card boundaries
  - Hover state with controls overlay (delete, reorder)
  - Image preview centered with object-fit: contain
  - Empty slots shown with dashed borders and "+" icon

### Card Management Controls
- Reorder via drag handles (six dots icon)
- Delete button (trash icon) on hover
- Card counter showing "X of 9 cards" per page
- Add card button in empty slots

### Print Controls
- Prominent "Preview Print Layout" button
- "Download PDF" or "Print" primary action
- Page navigation if multiple pages
- Settings toggle for border visibility (for trim guides)

### Page Preview Mode
- Full-page overlay showing exact print layout
- 3x3 grid at actual card dimensions
- Page breaks clearly marked
- Close/Edit buttons to return

### Import Section
- List showing cards from attached HTML files
- Checkboxes to select which existing cards to include
- "Import Selected" button
- Preview thumbnails of existing cards

## Navigation
Simple top bar:
- Application title "Card Printer" (left)
- Card count and page count (center)
- Print/Export buttons (right)

## Interactions & States
- **Upload**: Drag-over highlighting, progress bars
- **Cards**: Hover reveals controls, drag to reorder
- **Print**: Loading state while generating layout
- All buttons: Standard Material Design elevation and ripple effects

## Print Optimization
- Preserve exact CSS from attached files for print media queries
- @page settings: letter size, 0 margins for borderless
- Maintain 63mm x 88mm card dimensions
- 3x3 grid with no gaps for cutting
- Page breaks after each 9 cards

## Icons
**Library**: Heroicons (via CDN)
- Upload: cloud-arrow-up
- Delete: trash
- Reorder: bars-3 or arrows-up-down
- Print: printer
- Add: plus
- Import: arrow-down-tray

## Images
**No hero images required** - this is a utility application, not a marketing site. Focus on functional UI elements and card previews.