// "SelectEnd", is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the end attribute of an end node and is handled in the "DrawerFormatProviderGeneral" component.
const SelectEnd = ({ nodeData }) => {
    nodeData.data.isEnd = 'true';
    return;
};

export default SelectEnd;