import utils from "../../../utils/executeQuery.js"

async function getEvent(req, res, callback) {
    try {
        let id = req.params.id;
        let results = await utils.queryExecute(
            "eventService",
            "getEvent",
            [id],
            "eventMgmt"
        );
        
        console.log(results)
        if (results && results.recordset.length > 0) {
                const dateFromAPI = new Date(results.recordset[0].eventDate);
                const day = String(dateFromAPI.getDate()).padStart(2, '0'); 
                const month = String(dateFromAPI.getMonth() + 1).padStart(2, '0'); 
                const year = dateFromAPI.getFullYear();
                const formattedDate = `${day}/${month}/${year}`;

                let object = {
                    eventFields: [
                        { "title": results.recordset[0].title, "icon": results.recordset[0].icon }
                    ],
                    "eventStatus": results.recordset[0].status,
                    "activityDoneFor": results.recordset[0].activityDoneFor,
                    "activityTypeid": results.recordset[0].activity,
                    "activityType":results.recordset[0].activityType,
                    "taluka": results.recordset[0].taluka,
                    remark:results.recordset[0].remark,
                    "logoUrl": results.recordset[0].url,
                    "eventType": "Regular", 
                    "createdBy": results.recordset[0].username,
                    "eventDate": formattedDate,
                    "eventAddress": results.recordset[0].eventAddress,
                    "statusColour": "abcde", 
                    "customertoeventid":results.recordset[0].customertoeventid,
                };
                let res = await utils.queryExecute(
                    "eventService",
                    "getTaggedInvitees",
                    [id],
                    "eventMgmt"
                );
                let res1 = await utils.queryExecute(
                    "eventService",
                    "getTaggedContacts",
                    [id],
                    "eventMgmt"
                );
                let taggedParti = []
                if(res1 && res1.recordset.length>0){
                    res1.recordset.forEach(element => {
                        taggedParti.push({
                            "name": element.participantName, "number": element.Number,"contactid":element.contactid,"taggedid":element.taggedid
                        })
                    })
                //     object.taggedParticipants = taggedParti
                // }else{
                //     taggedParti.push([])
                //     object.taggedParticipants = taggedParti
                // }
                // console.log(res)

                const isAllNull = taggedParti.every(
                    participant => !participant.name && !participant.number && !participant.contactid && !participant.taggedid
                );

                if (isAllNull) {
                    object.taggedParticipants = [];
                } else {
                    object.taggedParticipants = taggedParti;
                }
            } else {
                object.taggedParticipants = [];
            }
            console.log(res);

          
           
                if(res && res.recordset.length>0){
                    let participantAttended = []
                    let participantInvited = []
                    if (results.recordset[0].status === "Completed") {
                        object.noOfAttendees = parseInt(results.recordset[0].noOfAttendees).toString() || ""; 
                        object.expensesIncurred = results.recordset[0].expensesIncurred || ""; 
                        object.statusColour = "0xFF00904D"; 
                        object.totalParticipants = parseInt(results.recordset[0].totalParticipants).toString() || ""
                        object.giftName = results.recordset[0].giftname || "";
                        object.giftCount = results.recordset[0].giftCount || "";
                        res.recordset.forEach(element => {
                            console.log(element.noOfAttendees,element)
                            if(element.attendedFlag ==='true'){
                                participantAttended.push({
                                    invitedBy:element.invitedBy,
                                    noOfAttendees:element.noOfAttendees,
                                    invitedById:element.customertoeventid
                                })
                            }
                            if(element.noOfInvitees !== null && (element.attendedFlag==='true' || element.attendedFlag === null)){
                                participantInvited.push({
                                    invitedBy:element.invitedBy,
                                    noOfInvitees:element.noOfInvitees,
                                    invitedById:element.customertoeventid
                                })
                            }
                        });

                        object.participantAttended = participantAttended
                        object.participantInvited = participantInvited
                        let uploadImages = [results.recordset[0].uploadImage1,results.recordset[0].uploadImage2,results.recordset[0].uploadImage3,results.recordset[0].uploadImage4,results.recordset[0].uploadImage5 ];
                      
    
                        if (uploadImages.length > 0) {
                            object.uploadImage = uploadImages.filter((image)=>image && image != "");
                        }  
    
                    } else if (results.recordset[0].status === "Planned") {
    
                        object.statusColour = "0xFF75479C";
                        object.noOfInvitees = parseInt(results.recordset[0].noOfInvitees).toString() || "";
                        res.recordset.forEach(element => {
                            participantInvited.push({
                                invitedBy:element.invitedBy,
                                noOfInvitees:element.noOfInvitees,
                                invitedById:element.customertoeventid
                            })
                        });
                        object.participantInvited = participantInvited
    
                        object.proposedBudget = results.recordset[0].budget || "";
                    }else if (results.recordset[0].status === "Cancelled") {
                        object.statusColour = "0xFFDA1D1F";
                    }
    
                callback({
                    statusCode: 200,
                    statusMessage: "Success",
                    "data": object
                });
                }else{
                    callback({
                        statusCode: 400,
                        statusMessage: "Failure",
                        data: {}
                    });
                }

        } else {
            callback({
                statusCode: 400,
                statusMessage: "Failure",
                data: {}
            });
        }
    } catch (err) {
        console.log(err);
        const errorResp = {
            statusCode: 500,
            statusMessage: "Internal Server Error",
            data: {}
        };
        callback(errorResp);
    }
}

export default { getEvent };
