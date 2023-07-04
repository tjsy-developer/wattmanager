
export default {
    domain:{
        backend_local: process.env.backendURL_local,
        backend1: process.env.backendURL,
        powertalk: {
            state: [
                "loginCheck",
                process.env.powertlakLogin_local,
                process.env.powertalkLogin
            ]
        }
    },
    powermemo: process.env.powermemo,
    powermemoSavefolder: process.env.powermemoSavefolder,
    qr_filePath: process.env.qr_filePath,
    qr: process.env.qr,
    att_access_user: process.env.att_access_user,
    att_videoPlayPath: process.env.att_videoPlayPath,
    att_filePath: process.env.att_filePath,
    detailFilePath: process.env.detailFilePath,
    fileUploadBackend: process.env.fileUploadBackend,
    useEnterprise: process.env.useEnterprise,
    use_bento4: process.env.use_bento4,
    elecQR: process.env.elecQR,
    elecFilePath: process.env.elecFilePath,
    elecFolderPath: process.env.elecFolderPath,
    fileBoxBackend: process.env.fileBoxBackend,
    separateBackendUploadPath: process.env.separateBackendUploadPath,
    impId: process.env.impId,
    pg: process.env.pg,
}
