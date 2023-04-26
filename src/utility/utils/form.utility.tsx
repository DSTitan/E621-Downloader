import { StylesConfig, Props } from "react-select";

const portal = document.getElementById("portal");

export const SelectMenuStyle = (data?: { menu?: any; option?: any; control?: any; singleValue?: any; multiValue?: any; multiValueLabel?: any; multiValueRemove?: any; input?: any; dark?: boolean; error?: boolean }): StylesConfig => {
    const selectData: StylesConfig = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "transparent",
            border: `2px solid ${"white"}`,
            borderRadius: "7px",
            borderColor: data?.error ? "#f04747 !important" : state.isFocused ? "#e94560 !important" : `${"white"} !important`,
            boxShadow: "none",
            opacity: state.isFocused ? "1 !important" : "0.6 !important",
            transition: "0.2s",
            cursor: "pointer",
            overflow: "visible",
            minHeight: "48px",
            ":hover": {
                borderColor: data?.error ? "#f04747 !important" : state.isFocused ? "#e94560 !important" : `${"white"} !important`,
                opacity: state.isFocused ? "1 !important" : "0.8 !important",
            },
            ...data?.control,
        }),
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: "#14172e",
            borderRadius: "7px",
            boxShadow: "box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px",
            zIndex: 5,
            ...data?.menu,
        }),
        menuList: (provided, state) => ({
            ...provided,
            backgroundColor: "#14172e",
            borderRadius: "7px",
            transition: "0.2s",
            padding: "5px",
            display: "grid",
            gap: "5px",
            zIndex: 5,
        }),
        group: (provided, state) => ({ display: "grid !important", gap: "5px !important" }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#e94560" : state.isFocused ? "#282d4f" : "#14172e",
            color: "white",
            fontSize: "1rem",
            transition: "0.3s",
            borderRadius: "7px",
            overflow: "hidden",
            cursor: "pointer",
            ":active": {
                backgroundColor: "#e94560",
            },
            ...data?.option,
        }),
        multiValue: (provided, state) => ({
            ...provided,
            backgroundColor: "#14172e",
            transition: "0.3s",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center !important",
            gap: "4px",
            maxHeight: "26px",
            ...data?.multiValue,
        }),
        multiValueLabel: (provided, state) => ({
            ...provided,
            margin: "0",
            padding: "0",
            paddingLeft: "7px",
            paddingRight: (state.data as any).isFixed ? "7px" : "0",
            color: "white",
            fontSize: "0.85rem",
            ...data?.multiValueLabel,
        }),
        multiValueRemove: (provided, state) => ({
            ...provided,
            borderRadius: "0 4px 4px 0",
            color: "white",
            display: (state.data as any).isFixed ? "none" : provided.display,
            height: "26px",
            ...data?.multiValueRemove,
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            padding: state.hasValue && state.isMulti ? "0.42646875rem 13px" : "0 13px",
        }),
        clearIndicator: (provided, state) => ({
            ...provided,
            transition: "0.2s",
            ":hover": {
                color: "#f04747",
            },
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            transition: "0.75s",
            transform: state.isFocused ? "rotate(450deg) !important" : "rotate(0deg) !important",
            ...(state.isFocused ? { color: "#43b581" } : {}),
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: "white",
            outline: "none",
            transition: "0.3s",
            margin: 0,
            padding: 0,
            ...data?.singleValue,
        }),
        placeholder: (provided, state) => ({
            ...provided,
            color: "white",
            margin: 0,
            padding: 0,
            opacity: "0.5",
            ...data?.input,
        }),
        input: (provided, state) => ({
            ...provided,
            color: "white",
            margin: 0,
            padding: 0,
            overflow: "hidden",
            ...data?.input,
        }),
        menuPortal: (provided, state) => ({
            ...provided,
            zIndex: 206,
        }),
    };

    return selectData;
};

export const SelectMenuProps: Props = {
    menuPortalTarget: portal,
    menuPlacement: "auto",
    closeMenuOnScroll: true,
    filterOption: (option: any, input) => (input ? (option.data?.search?.toLowerCase().includes(input.toLowerCase() || option.data?.value?.toLowerCase().includes(input.toLowerCase())) ? true : false) : true),
};

export const SelectMenuDefaultFilterProps: Props = {
    menuPortalTarget: portal,
    menuPlacement: "auto",
    closeMenuOnScroll: true,
};
