import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import * as constants from "../constants";

const DraggableItem = ({ item, index, onItemMove }) => {
    const ItemType = "ITEM";

    const [{ isDragging }, dragRef] = useDrag({
        type: ItemType,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop({
        accept: ItemType,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                onItemMove(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div ref={(node) => dragRef(dropRef(node))} className="sortable-list" style={{ opacity: isDragging ? 0 : 1 }}>
            {item[constants.NAME_KEY]}
        </div>
    );
};

const SortableList = ({ items, onOrderSave, onItemMove }) => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    // Big hack to help the drag states initialize by forcing an instant re-render
    const [, setRenderKey] = useState(0);

    useEffect(() => {
        setRenderKey((prev) => prev + 1);
    }, []);

    return (items.length === 0 ? <div>No categories</div> :
        <>
            <DndProvider backend={isAndroid ? TouchBackend : HTML5Backend}>
                {items.map((item, index) => (
                    <DraggableItem
                        key={item[constants.CATEGORY_ID_KEY]}
                        item={item}
                        index={index}
                        onItemMove={onItemMove}
                    />
                ))}
            </DndProvider>
            <Button variant="success" onClick={() => onOrderSave()}>Save</Button>
        </>
    );
};

DraggableItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onItemMove: PropTypes.func.isRequired,
};

SortableList.propTypes = {
    items: PropTypes.array.isRequired,
    onOrderSave: PropTypes.func.isRequired,
    onItemMove: PropTypes.func.isRequired,
};

export default SortableList;
