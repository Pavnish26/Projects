import utils from "../../../utils/executeQuery.js"

async function fetchPlannedInfo(req, res, callback) {
    try {
        let id = req.params.id;
        let status = req.query.status;
        let eventDate = req.query.eventDate;
        let taluka = req.query.taluka;
        let eventDate1 = eventDate
        let activityDoneFor = req.query.activityDoneFor;
        let activityType = req.query.activityType;     
if (eventDate === "") {
            eventDate = null;
            eventDate1 = null
        } 
        else{
            eventDate = eventDate+' 00:00:00'
            eventDate1 = eventDate1+" 23:59:59"
        }
        let results = await utils.queryExecute(
            "eventService",
            "getEventPlanned",
            [id,status,eventDate,eventDate1,taluka,activityDoneFor,activityType],
            "eventMgmt"
        );
        let data = []
        if(results && results.recordset.length > 0){
            const formattedDate = results.recordset.map((row) =>{
                const dateFromAPI = new Date(row.eventDate);
            const day = String(dateFromAPI.getDate()).padStart(2, '0'); 
            const month = String(dateFromAPI.getMonth() + 1).padStart(2, '0'); 
            const year = dateFromAPI.getFullYear(); 
            const formattedDate = `${day}/${month}/${year}`;

            let eventColor = "";
            if (status === "Planned") {
                eventColor = "0xFF75479C"; 
            } else if (status === "Completed") {
                eventColor = "0xFF00904D"; 
            } else if (status === "Cancelled") {
                eventColor = "0xFFDA1D1F";
            }

            let org_status = "";
            if (row.orginalStatus === "970150000") {
                org_status = "Planned"; 
            } else if (row.orginalStatus === "970150001") {
                org_status = "Completed"; 
            } else if (row.orginalStatus === "970150002") {
                org_status = "Cancelled";
            }

               let object = {
                eventFields:[
                {"title":row.title,"icon": row.icon}
               ],
               "eventStatus": status,
               "activityDoneFor": row.activityDoneFor,
            //    "logoUrl": row.url,
            "logoUrl": row.iconImage,
               "activityType" :row.activityType,
               "taluka": row.taluka,
               "totalInvitees": (row.totalInvitees ?? "").toString(),
               "totalAttendees":(row.totalAttendees ?? "").toString(),
               "eventDate": formattedDate,
               "eventColor": eventColor, 
               "eventId": row.eventid,
               "orignalStatus":org_status ?? ""
            }
            data.push(object)
            });
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
        console.log(err)
        const errorResp = {
            statusCode:500,
            statusMessage:"Internal Server Error",
            data:{}
        }
        callback(errorResp)
    }

}

export default { fetchPlannedInfo}



