# Modal Blog Concept

## Overview

The modal blog concept provides a standardized approach for presenting detailed project information in a structured, blog-like format within modal windows. This document outlines the design patterns, content structure, and implementation guidelines to ensure consistency across all project presentations.

## Content Structure

### Base Properties

Each project modal should include the following base properties:

| Property | Description | Required |
|----------|-------------|----------|
| `title` | Project title (displayed as the modal's main heading) | Yes |
| `intro` | Brief introduction paragraph that summarizes the project | Yes |
| `technologies` | Array of technologies used in the project | Yes |
| `sections` | Array of content sections (detailed below) | Yes |
| `images` | Array of image paths for the carousel (optional) | No |
| `category` | Project category for filtering purposes | Yes |
| `demoUrl` | Link to live demo (optional) | No |
| `repoUrl` | Link to code repository (optional) | No |

### Section Structure

Each section within the `sections` array should follow this structure:

```javascript
{
    title: 'Section Title',
    body: '<p>HTML content of the section...</p>',
    type: 'header|standard|subtitle' // Section typology
}
```

### Section Types

Three types of sections are supported to create visual hierarchy:

1. **`header`** - Major sections that represent main topics or chapter divisions
   - Used for: Project overviews, main contributions, key outcomes
   - Styling: Larger font, bottom border in gold color, primary font

2. **`standard`** - Regular content sections 
   - Used for: Detailed explanations, features, implementation details
   - Styling: Medium font size, standard formatting

3. **`subtitle`** - Supporting or subsidiary sections
   - Used for: Technical details, team information, additional notes
   - Styling: Smaller font, possibly italic, less emphasis

## Content Organization Pattern

For consistency, project modals should organize content in a similar pattern:

1. **Introduction** (Brief overview of the project purpose and value)
2. **Context Sections** (Background information, problem statement)
   - `type: 'header'` for main context sections
3. **Solution Sections** (Technical implementation, approach)
   - `type: 'standard'` for implementation details
4. **Outcome Sections** (Results, impacts, metrics)
   - `type: 'header'` for highlighting outcomes
5. **Supporting Information** (Team, technologies detail, etc.)
   - `type: 'subtitle'` for auxiliary information

## Implementation Details

### HTML Structure

All sections are rendered with `h4` tags with different CSS classes based on the section type:

```html
<section class="section-type-[type]">
  <h4 class="typography-section-[type]">[Section Title]</h4>
  <div class="modal-section-body body-type-[type]">[Section Content]</div>
</section>
```

### CSS Classes

The following CSS classes are used to style the different section types:

- `.typography-section-header` - Major section styling
- `.typography-section-standard` - Standard section styling
- `.typography-section-subtitle` - Subsidiary section styling

### Visual Styling Guidelines

- **Modal Title**: Largest element (h3.modal-title, 3.6rem)
- **Header Sections**: Prominent with bottom border (2.4rem, with gold border)
- **Standard Sections**: Clear but subordinate to headers (2rem)
- **Subtitle Sections**: Smaller and possibly italic (1.8rem)

## Example Implementation

```javascript
{
    title: 'Project Name',
    intro: '<p>Brief project overview that explains the purpose and value.</p>',
    sections: [
        {
            title: 'Background',
            body: '<p>Context about the project situation and needs.</p>',
            type: 'header'
        },
        {
            title: 'Solution Approach',
            body: '<p>How the problem was addressed technically.</p>',
            type: 'standard'
        },
        {
            title: 'Key Results',
            body: '<p>Outcomes and impact of the implementation.</p>',
            type: 'header'
        },
        {
            title: 'Technical Stack',
            body: '<p>Detailed explanation of technologies used.</p>',
            type: 'subtitle'
        }
    ],
    technologies: ['Tech1', 'Tech2', 'Tech3'],
    category: 'project-category'
}
```

## Best Practices

1. **Consistency**: Maintain consistent section ordering and typing across all projects
2. **Conciseness**: Keep section content focused and scannable
3. **Hierarchy**: Use section types to create clear visual hierarchy
4. **Complete Information**: Ensure all projects cover context, solution, and outcomes
5. **Visual Support**: Include relevant images in the carousel when available

## Maintenance

When adding new project modals or updating existing ones:

1. Follow the section structure and typing conventions
2. Maintain the recommended content organization pattern
3. Ensure all required properties are included
4. Validate that section types create appropriate visual hierarchy