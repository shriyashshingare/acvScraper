import React, { Component } from 'react';

//Material UI
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText
} from '@material-ui/core/';

class DialogBox extends Component {
    render() {
        const {
            DialogHeader,
            DialogContentTextData,
            children,
            DialogButtonText1,
            DialogButtonText2,
            onClose,
            onOpen,
            OnClick_Bt1,
            OnClick_Bt2,
            disableBackdropClick,
            maxWidth,
            fullWidth,
            Variant,
            B1backgroundColor,
            B1color,
            B2backgroundColor,
            B2color
        } = this.props;
        return (
            <div>
                <Dialog maxWidth={maxWidth} fullWidth={fullWidth} disableBackdropClick={disableBackdropClick} open={onOpen} onClose={onClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{DialogHeader}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {DialogContentTextData}
                        </DialogContentText>
                        {children}
                    </DialogContent>
                    <DialogActions>
                        {DialogButtonText1 ? <Button style={B1backgroundColor ? { backgroundColor: B1backgroundColor, color: B1color } : {}} variant={Variant} onClick={OnClick_Bt1} color="primary">
                            {DialogButtonText1}
                        </Button> : null}
                        <Button style={B2backgroundColor ? { backgroundColor: B2backgroundColor, color: B2color } : {}} variant={Variant} onClick={OnClick_Bt2} color="primary">
                            {DialogButtonText2}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default DialogBox
