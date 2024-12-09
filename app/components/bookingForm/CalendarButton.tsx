import { Button } from "@/components/ui/button";
import { type AriaButtonProps, useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import type { CalendarState } from "@react-stately/calendar";
import { useRef } from "react";

export function CalendarButton(props: AriaButtonProps<"button"> & { state?: CalendarState; side?: 'left' | 'right'}){

    const ref = useRef(null);
    const {buttonProps} = useButton(props, ref);
    const { focusProps } = useFocusRing();
    return(
        <Button variant={'outline'} size={"icon"} {...mergeProps(buttonProps, focusProps)} ref={ref} disabled={props.isDisabled}>
            {props.children}
        </Button>
    )
}