const roleMappings = {
    Admin : [
        "List_Products", "List_Users", "List_Orders",
        "Create_Product", "Create_User", "Create_Order",
        "Update_Product", "Update_User", "Update_Order",
        "Delete_Product", "Delete_User", "Delete_Order", "Assign_Role"
    ],
    Employee : [
        "List_Products", "List_Orders",
        "Create_Product", "Create_Order",
        "Update_Product", "Update_Order",
        "Delete_Product", "Delete_Order"
    ],
    Customer : [
        "List_Products", "Create_Order"
    ]
};

module.exports = roleMappings;
