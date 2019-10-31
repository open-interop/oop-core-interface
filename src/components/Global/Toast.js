import toastr from "toastr";

toastr.options = {
    preventDuplicates: false,
    timeOut: 5000,
    extendedTimeOut: 1000,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
};
const SuccessToast = (message, title) => {
    return toastr.success(message, title);
};

const ErrorToast = (message, title) => {
    return toastr.error(message, title);
};

const clearToast = () => {
    return toastr.clear();
};

export { SuccessToast, ErrorToast, clearToast };
