import { PropTypes } from "prop-types";
import { Button } from "react-bootstrap";
import SortableList from "../SortableList";

const EditCategoriesPopup = (props) => {
    return (
        <div>
            <div className="popup-header">
                <div></div>
                <Button className="restart popup-icon" onClick={props.onPopupClose} >X</Button>
            </div>
            <div>
                <SortableList items={props.categories} onOrderSave={props.onOrderSave} onItemMove={props.onItemMove} />
            </div>
        </div >
    );
}

EditCategoriesPopup.propTypes = {
    categories: PropTypes.array,
    onOrderSave: PropTypes.func,
    onPopupClose: PropTypes.func,
    onItemMove: PropTypes.func
};

export default EditCategoriesPopup;