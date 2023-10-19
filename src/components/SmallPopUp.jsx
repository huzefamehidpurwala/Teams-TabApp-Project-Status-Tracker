import { DialogSurface, Spinner } from "@fluentui/react-components";
import React from "react";

const SmallPopUp = (props) => {
  return (
    <DialogSurface>
      <div {...props}>
        <Spinner size="huge" labelPosition="below" label={props.msg} />
      </div>
    </DialogSurface>
  );
};

export default SmallPopUp;
