import React from "react";
import {Content, DisplayStyle} from "./styles.js";
import { StyleSheetManager } from 'styled-components';
import Navbar from "../organisms/navbar/index.jsx";
const Layout = ({ children, title }) => {
    return (
        <StyleSheetManager>
            <DisplayStyle>
                <Navbar title={title}/>
                <Content>
                    {children}
                </Content>

            </DisplayStyle>
        </StyleSheetManager>
    )

}

export default Layout;
