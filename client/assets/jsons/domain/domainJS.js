
const domain = {
    backend_local: process.env.backendURL_local,
    backend1: process.env.backendURL,
    powertalk: {
        state: [
            "loginCheck",
            process.env.powertlakLogin_local,
            process.env.powertalkLogin
        ]
    }
}
const powermemo = process.env.powermemo
const powermemoSavefolder = process.env.powermemoSavefolder
const qr_filePath = process.env.qr_filePath
const qr = process.env.qr
const att_access_user = process.env.att_access_user
const att_videoPlayPath = process.env.att_videoPlayPath
const att_filePath = process.env.att_filePath
const detailFilePath = process.env.detailFilePath
const fileUploadBackend = process.env.fileUploadBackend
const useEnterprise = process.env.useEnterprise
const use_bento4 = process.env.use_bento4
const elecQR = process.env.elecQR
const elecFilePath = process.env.elecFilePath
const elecFolderPath = process.env.elecFolderPath
const fileBoxBackend = process.env.fileBoxBackend
const separateBackendUploadPath = process.env.separateBackendUploadPath
const impId = process.env.impId
const pg = process.env.pg
