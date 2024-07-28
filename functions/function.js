import router from "../modules/router-netlify/router-net.js"
import FileFacade from '../modules/pm-file/fileFacade.js'

exports.handler = async function (event, context) {
    router.start(event);

    router.POST('strfile', async () => {

        const { fileStr } = JSON.parse(event.body)
        if (fileStr) {
            // process fileUrl
            const result = await FileFacade.processStr(fileStr);
            if (result) {
                // send response
                router.setRes(result)
            } else {
                router.error();
            }
        } else {
            router.error();
        }
    })

    await router.POST('urlfile', async () => {
        const { fileUrl } = JSON.parse(event.body)
        if (fileUrl) {
            // process fileUrl
            const result = await FileFacade.processUrl(fileUrl);
            if (result) {
                // send response
                router.setRes(result)
            } else {
                router.error();
            }
        } else {
            router.error();
        }
    })

    return router.sendRes()
};


