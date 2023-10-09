
const trimmer = (item) =>{
    if(item != undefined && item != null && typeof item == "string"){        
        return item.toString().trim();
    }
    return null;
}

module.exports = { trimmer };