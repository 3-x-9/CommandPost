import { EndpointDef } from "./types";

export const MOCK_ENDPOINTS: EndpointDef[] = [
    {
        method: "GET",
        path: "/users",
        summary: "List Users",
        description: "Get a list of all users",
        tags: ["Users"]
    },
    {
        method: "POST",
        path: "/users",
        summary: "Create User",
        description: "Create a new user",
        tags: ["Users"]
    },
    {
        method: "GET",
        path: "/users/{id}",
        summary: "Get User",
        description: "Get user by ID",
        tags: ["Users"]
    },
    {
        method: "GET",
        path: "/products",
        summary: "List Products",
        description: "Get all products",
        tags: ["Products"]
    }
];
