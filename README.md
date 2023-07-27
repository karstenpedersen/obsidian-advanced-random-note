# Advanced Random Note Obsidian Plugin

This plugin enables you to create custom queries for opening random notes.

## Features

-   Create custom queries on the settings tab
    -   Find random notes using filename, path, and tags
    -   Enable them as commands
-   Open Random Note Modal: Open modal to select a query
-   Open Random Note: Open note from the vault
-   Disable folders from being included in the searches

### Settings Tab

![Settings Image](https://raw.githubusercontent.com/karstenpedersen/obsidian-advanced-random-note/master/settings-screenshot.png)

## Installation

### Obsidian

1.  Open Settings
2.  Go to "Community Plugins"
3.  Enable community plugins by pressing "Turn on community plugins"
4.  Click "Browse" to browse available community plugins
5.  Search for "Advanced Random Note"
6.  Click Install and enable the plugin
7.  Close the community plugins window

## Getting Started

### Queries

This plugin queries markdown notes using syntax similar to the [Obsidian Search](https://help.obsidian.md/Plugins/Search) plugin but is more primitive.

#### Tags

You can query files by their tags. Do this by specifying the `tag:` keyword. After this, you can write multiple tags that should be included and excluded from the file.

-   If tags should not be in the file, then write `!` in front of them, like this: `tag: idea !complete`. This will get files that have the `idea` tag, but not the `complete` tag.
-   You can also write `#` in front of the tags, like this: `#idea` and `!#complete`,

#### Paths

You can query files by their path. To do this, specify the `path:` keyword and write what the path should contain to be included in the result.

#### Filename

You can query files by their filename. To do this, specify the `file:` keyword and write what the filename should contain to be included in the result.

### Disabled Folders

You can disable folders to remove them from being searched. This can be useful if you have a template folder that you do not want to open files from.

### Enable Queries as Commands

Queries can be enabled as commands by clicking the toggle next to them when on the plugins settings tab. This can be useful in combination with the [Commander](https://github.com/phibr0/obsidian-commander) plugin.

## Examples

### Find Ideas in your Vault

Find a random incomplete idea.

-   Query: `tag: idea !complete`.

### Find Untitled Files

Find an untitled note.

-   Query: `file: Untitled`

### Find a Fleeting Note in the root Directory

You can combine keywords.

-   Query: `path: / tag: fleeting`

## Version History

### Version 0.0.6

-   Add `Open Random Note` command
-   Add `Open Random Note Modal` command
-   Add plugin settings tab
-   Add user queries
-   Add ability to toggle user queries as commands

## Contact

-   Get in contact on the plugins GitHub
