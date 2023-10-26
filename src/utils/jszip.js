import JSZip from "jszip";
import { saveAs } from "file-saver";
import notificationWithIcon from "./notificationWithIcon";

var zip = JSZip();

const download = () => {


    zip.generateAsync({ type: "blob" }).then(function (blob) {
        saveAs(blob, "campaign-qrcode.zip");
    });

};

export const generateZip = (arr = []) => {

    if (arr.length) {
        notificationWithIcon("success", "Downloading...",);
        for (const element of arr) {
            const regex = /data:.*base64,/
            element.qrcode = element.qrcode.replace(regex, "")
            zip.file(element.campaign_user_id + "-" + element.ref_code + ".png", element.qrcode, { base64: true })
        }

        download();
    } else {
        notificationWithIcon("error", "Download Failed", "Promotion referral do not exist");
    }

};
