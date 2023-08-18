import {
  CommandButtonGroup,
  HistoryButtonGroup,
  ToggleBoldButton,
  ToggleHeadingButton,
  ToggleItalicButton,
  ToggleUnderlineButton,
  Toolbar,
} from "@remirror/react";

// Additional button controls require the appropriate extensions to be
// defined in the `useRemirror()` hook in <TextEditor>

const EditorToolbar = () => (
  <Toolbar>
    <CommandButtonGroup>
      <ToggleBoldButton />
      <ToggleItalicButton />
      <ToggleUnderlineButton />
    </CommandButtonGroup>
    <CommandButtonGroup>
      <ToggleHeadingButton attrs={{ level: 1 }} />
      <ToggleHeadingButton attrs={{ level: 2 }} />
    </CommandButtonGroup>
    <HistoryButtonGroup />
  </Toolbar>
);

export default EditorToolbar;
