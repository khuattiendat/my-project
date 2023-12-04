import Swal from 'sweetalert2'
import { SnackbarProvider, useSnackbar } from "notistack";
import React from 'react';
export const showAlertError = (message) => {
    Swal.fire({
        title: "error",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
    });
};
export const showAlertSuccess = (message) => {
    Swal.fire({
        title: "success",
        text: message,
        icon: "success",
        confirmButtonText: "OK",
    });
};
export const showAlertWarning = (message) => {
    Swal.fire({
        title: "warning",
        text: message,
        icon: "warning",
        confirmButtonText: "OK",
    });
};
export const showAlertConfirm = (title, text) => {
    return Swal.fire({
        title: title,
        icon: 'warning',
        text: text,
        showCancelButton: true,
        confirmButtonText: 'Có!',
        cancelButtonText: 'Không!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            return true;
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            return false
        }
    })
}
