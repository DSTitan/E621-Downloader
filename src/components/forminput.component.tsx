import React from "react";
import Select from "react-select";
import SelectCreatable from "react-select/creatable";
import { BiCheck, BiMinus, BiPlus } from "react-icons/bi";

import * as Utility from "../utility/utils/form.utility";

const FormInput: React.FC<{ className?: string; type: "text" | "number" | "textarea" | "select" | "combo-select" | "button-select" | "toggle-switch" | "toggle-checkbox"; value?: any; options?: any[]; onChange?: (a: React.ChangeEvent<HTMLInputElement>) => any; onClick?: (a: React.ChangeEvent<HTMLInputElement>) => any; label?: string; placeholder?: string; tooltip?: any; error?: boolean; disabled?: boolean; dark?: boolean; errorMessage?: string; htmlFor?: string; additionalProps?: any; icon?: any }> = (props) => {
    let input: any = null;
    switch (props.type) {
        case "text":
            input = <input type="text" id={props.htmlFor} className={`input ${props.additionalProps?.inputClass ? props.additionalProps?.inputClass : ""}`} autoComplete="off" placeholder={props.placeholder} value={props.value} onChange={props.disabled ? null : props.onChange} onClick={props.onClick} {...props.additionalProps} />;
            break;
        case "number":
            input = <input type="number" id={props.htmlFor} className={`input ${props.additionalProps?.inputClass ? props.additionalProps?.inputClass : ""}`} autoComplete="off" placeholder={props.placeholder} value={props.value} onChange={props.disabled ? null : props.onChange} onClick={props.onClick} {...props.additionalProps} />;
            break;
        case "textarea":
            input = <textarea id={props.htmlFor} className={`input ${props.additionalProps?.inputClass ? props.additionalProps?.inputClass : ""}`} autoComplete="off" placeholder={props.placeholder} value={props.value} onChange={props.disabled ? null : props.onChange} {...props.additionalProps} />;
            break;
        case "select":
            input = <Select {...Utility.SelectMenuProps} id={props.htmlFor} className={`input ${props.additionalProps?.inputClass ? props.additionalProps?.inputClass : ""}`} placeholder={`${props.placeholder} ${props.additionalProps?.isMulti ? "..." : ""}`} value={props.value} options={props.options} onChange={props.disabled ? null : props.onChange} styles={Utility.SelectMenuStyle({ dark: props.dark, error: props.error })} {...props.additionalProps} />;
            break;
        case "combo-select":
            input = <SelectCreatable {...Utility.SelectMenuDefaultFilterProps} id={props.htmlFor} className={`input ${props.additionalProps?.inputClass ? props.additionalProps?.inputClass : ""}`} placeholder={`${props.placeholder} ${props.additionalProps?.isMulti ? "..." : ""}`} value={props.value} options={props.options} onChange={props.disabled ? null : props.onChange} styles={Utility.SelectMenuStyle({ dark: props.dark, error: props.error })} {...props.additionalProps} />;
            break;
        case "button-select":
            input = (
                <div
                    className="input button gap-2"
                    children={props.options?.map((option) => {
                        const active = (props.additionalProps?.isMulti && props.value.find((value: any) => value === option.value)) || props.value === option.value;

                        const button = (
                            <button
                                className={`hover02 color-${active ? (props.additionalProps?.checkColor ? props.additionalProps?.checkColor : "success") : "secondary"}`}
                                onClick={() => {
                                    let value = props.additionalProps?.isMulti ? [] : option;
                                    if (props.additionalProps?.isClearable && !props.additionalProps?.isMulti && option.value === props.value) value = null;
                                    else if (props.additionalProps?.isClearable && props.additionalProps?.isMulti) props.options?.map((o: any) => (props.value.find((value: any) => value === o.value && value === option.value) || (option.value !== o.value && !props.value.find((value: any) => value === o.value)) ? null : value.push(o)));
                                    else if (!props.additionalProps?.isClearable && props.additionalProps?.isMulti) props.options?.map((o: any) => ((props.value.find((value: any) => value === o.value && value === option.value) && props.value.length > 1) || (option.value !== o.value && !props.value.find((value: any) => value === o.value)) ? null : value.push(o)));
                                    if (props.onChange) props.onChange(value as any);
                                }}>
                                {props.additionalProps?.checkPlacement === "left" && active && <span className="button-icon left" children={<BiCheck />} />}
                                {(!props.additionalProps?.checkPlacement || props.additionalProps?.checkPlacement === "right") && option.icon && <span className="button-icon left" children={option.icon} />}
                                <span className="button-text" children={option.label} />
                                {props.additionalProps?.checkPlacement === "left" && option.icon && <span className="button-icon right" children={option.icon} />}
                                {props.additionalProps?.checkPlacement === "right" && active && <span className="button-icon right" children={<BiCheck />} />}
                            </button>
                        );
                        return button;
                    })}
                />
            );
            break;
        case "toggle-switch":
            input = (
                <div className={`input toggle-button-cover ${props.additionalProps?.toggleLarge ? "toggle-lg" : ""}`} toggle-size="1">
                    <div className="button-cover">
                        <div className="toggle-button b2" id="toggle-button-1">
                            <input type="checkbox" className="checkbox" checked={props.value} onChange={props.disabled ? null : props.onChange} {...props.additionalProps} />
                            <div className="toggle-knobs" />
                            <div className={`toggle-layer ${props.additionalProps?.toggleColor}`} />
                        </div>
                    </div>
                </div>
            );
            break;
        case "toggle-checkbox":
            input = (
                <label className="input toggle-checkbox" htmlFor={props.htmlFor}>
                    <input type="checkbox" id={props.htmlFor} checked={props.value} onChange={props.disabled ? null : props.onChange} {...props.additionalProps} />
                    <span className="slider" children={<BiCheck className="icon" />} />
                </label>
            );
            break;
    }

    const label = (
        <label htmlFor={props.htmlFor} className={`label ${props.additionalProps?.labelClass?.includes("opacity") ? "" : "opacity-50"} ${props.additionalProps?.labelClass}`}>
            {props.label}
        </label>
    );

    const error = <label htmlFor={props.htmlFor} className="error" children={props.errorMessage} />;

    return (
        <div className={`relative form-input ${props.type}-input ${props.dark ? "dark" : ""} ${props.error ? "error" : ""} ${props.disabled ? "disabled" : ""} ${props.className ? props.className : ""}`}>
            {props.type === "number" && props.additionalProps?.premium !== true && (
                <div className="arrows">
                    <BiMinus className="left-arrow" onClick={() => (props.disabled ? null : props.onChange?.({ target: { value: props.value - 1 } } as any))} />
                    <BiPlus className="right-arrow" onClick={() => (props.disabled ? null : props.onChange?.({ target: { value: props.value + 1 } } as any))} />
                </div>
            )}
            {props.icon}
            {props.type.startsWith("toggle") ? (
                <div className={`flex gap-4 ${props.additionalProps?.toggleSpace ? "justify-between" : ""}`}>
                    {props.additionalProps?.togglePlacement === "left" && input}
                    {props.label && label}
                    {(props.additionalProps?.togglePlacement === "right" || !props.additionalProps?.togglePlacement) && input}
                </div>
            ) : (
                <>
                    {props.label && label}
                    {input}
                </>
            )}
            {props.errorMessage && error}
        </div>
    );
};

export default FormInput;
