import { createBrowserRouter } from "react-router-dom";
// import { Children } from "react";
import App from "../App";

const router = createBrowserRouter([
    {
        path:'/',
        element: <App />,
        children:[
            {
                index: true,
                element:""
            },
        ],
    },
]);

export default router;