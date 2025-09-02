import utils from "../../../utils/executeQuery.js"
import { multiValQuery} from "../../../utils/common-functions.js"
async function getInvitedBy(req, res, callback) {
    try {
        let id = req.params.id;
        let results = await utils.queryExecute(
            "eventService",
            "getInvitedBy",
            [id],
            "eventMgmt"
        );
        let data = [];
        let specialObjectAdded = false; 
        if(results && results.recordset.length > 0){
            const formattedDate = results.recordset.map((row) =>{
           
            data.push({
                "cseName": row.csename,
                "shortName": row.companyShortName,
                "name": row.name,
                "sapname": row.sapnumber,
                id:row.id,
                role:row.role
            });
        });
        let cseName = data[0].csename
        let res
        let dealerCountInfo = await getNetworkDealerCount(id)
        let dealerId=[]
        dealerCountInfo.forEach(element => {
            dealerId.push(element.accountid)
        });
        if(dealerCountInfo){
            let multiVal = multiValQuery(dealerId,'pa.aus_customer IN ',2) ?? ""
            let retailerCountInfo = await getNetworkRetailerCount(multiVal,cseName)
            if(retailerCountInfo){
                res = retailerCountInfo
                data = [...res,...data]
            }else{
                res = null
            }
        }else{
            res = null

        }
            callback({
                statusCode:200,
                statusMessage:"Success",
                "data":data
            });
        }else{
            callback({
                statusCode:400,
                statusMessage:"Failure",
                data:{}
            });
        }
    } catch (err) {
        console.log(err);
        const errorResp = {
            statusCode:500,
            statusMessage:"Internal Server Error",
            data:{}
        }
        callback(errorResp)
    }

}


async function getNetworkDealerCount(id){
    try {
        console.log(`Entering profile.cseProfile.getNetworkDealerCount successfully`)
        let results = await utils.queryExecute(
            "cseProfile",
            "getDealerCount",
            [id],
            "profile"
        );
        if (results && results.recordset && results.recordset.length > 0) {
            console.log(`Exiting profile.cseProfile.getNetworkDealerCount successfully`)
            let res = []
            res = results.recordset.filter(object => object.idVal !== null)
            return res
    
        }else if(results   && results.recordset.length === 0){
            console.log(`Exiting profile.cseProfile.getNetworkDealerCount zero dealer`)
            return false;
        } else {
            console.log(`Exiting profile.cseProfile.getNetworkDealerCount query fail`)
            return null;
        }
    } catch (err) {
        console.error(
            `Error caused by internal error in profile.cseProfile.getNetworkDealerCount, ${err}`
        );
        return null;
    }
}


async function getNetworkRetailerCount(id,cseName){
    try {
        console.log(`Entering profile.cseProfile.getNetworkRetailerCount successfully`)
        let results = await utils.updateExecute(
            "cseProfile",
            "getRetailerCount",
            [],
            id,
            "profile"
        );
        if (results && results.recordset && results.recordset.length > 0) {
            console.log(`Exiting profile.cseProfile.getNetworkRetailerCount successfully`)
            let impInfo=[]
            let res = []
            res = results.recordset.filter(object => object.idVal !== null)
            res.forEach(element => {
                impInfo.push({
                    cseName:cseName,
                    name:element.name,
                    id:element.accountid,
                    companyShortName:element.companyShortName,
                    sapname: element.sapnumber,
                    role:element.role
                })
            });
            return impInfo
        }else if(results   && results.recordset.length === 0){
            console.log(`Exiting profile.cseProfile.getNetworkRetailerCount zero dealer`)
            return false;
        } else {
            console.log(`Exiting profile.cseProfile.getNetworkRetailerCount query fail`)
            return null;
        }
    } catch (err) {
        console.error(
            `Error caused by internal error in profile.cseProfile.getNetworkRetailerCount, ${err}`
        );
        return null;
    }
}

export default {getInvitedBy}



