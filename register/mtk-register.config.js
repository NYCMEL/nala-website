/* mtk-register.config.js */

window.mtkRegisterConfig = {
    title: "NALA Locksmith Registration Form",
    fields: {
        firstName: {
            id: "firstName",
            label: "First Name",
            helper: "First Name",
            required: true,
            value: "Mel"
        },
        middleInitial: {
            id: "middleInitial",
            label: "M.I.",
            helper: "",
            required: false,
            value: "M"
        },
        lastName: {
            id: "lastName",
            label: "Last Name",
            helper: "Last Name",
            required: true,
            value: "Heravi"
        },
        email: {
            id: "email",
            label: "Your Email",
            helper: "example@example.com",
            required: true,
            value: "mel@gmail.com"
        },
        email2: {
            id: "email2",
            label: "Repeat Email",
            helper: "",
            required: true,
            value: "mel@gmail.com"
        },
        phone: {
            id: "phone",
            label: "Contact Phone Number",
            helper: "Phone Number",
            required: true,
            value: "6463031234"
        }
    }
};
