export declare enum PermissionAction {
    CREATE = "Create",
    READ = "Read",
    UPDATE = "Update",
    DELETE = "Delete",
    APPROVE = "Approve",
    REJECT = "Reject",
    EXPORT = "Export",
    IMPORT = "Import",
    ASSIGN = "Assign",
    MANAGE = "Manage"
}
export declare class PermissionListingDto {
    page?: number;
    limit?: number;
    search?: string;
    sortField?: string;
    sortOrder?: string;
}
export declare class SavePermissionDto {
    module: string;
    action: PermissionAction;
    description?: string;
}
