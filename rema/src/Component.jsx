import React, { useEffect, useRef } from "react";
import "./style.css"; // Assuming your styles are still needed

const Component = ({
    width = 1000,
    text1 = "Default Text 1",
    text2 = "Default Text 2",
    text3 = "Default Text 3",
    text4 = "Default Text 4",
    text5 = "Default Text 5",

}) => {
    const ref = useRef(null);

    // Update width of the component
    const updateWidth = (width) => {
        if (ref.current) {
            ref.current.style.setProperty("--custom-width", `${width}px`);
        }
    };

    // UseEffect to update width on mount
    useEffect(() => {
        updateWidth(width);
        console.log("Component is rendering with width:", width);
    }, [ref]);

    return (
        <div ref={ref} style={{ backgroundColor: 'white', color: 'grey', paddingLeft: '5%', padding: '30px', width: '800px', borderRadius: '10px', textAlign: 'left' }}>
            <h2>{text1}</h2>
            <h1>{text2}</h1>
            <h3>{text3}</h3>
            <h3>{text4}</h3>
            <h3>{text5}</h3>

        </div >
    );
};

export default Component;
