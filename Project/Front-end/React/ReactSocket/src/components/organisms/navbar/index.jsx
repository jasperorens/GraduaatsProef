import React from "react";
import {NavbarDesign, Title} from "./styles.js";
const Navbar = ({ title }) => {
    return (
        <NavbarDesign>
            <Title>{title}</Title>
        </NavbarDesign>
    )

}

export default Navbar;
