export interface MailOptions {
    from: string;
    to: string | string[];
    subject: string;
    template: string;
    locals: any;
}
