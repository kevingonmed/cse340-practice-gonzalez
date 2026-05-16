import {
    getFacultyById,
    getSortedFaculty
} from "../../models/faculty/faculty.js"


const facultyListPage = (req, res) => {

    const sortBy = req.query.sort

    const faculty = getSortedFaculty(sortBy)

    console.log("sortBy:", sortBy);
    console.log("faculty count:", faculty.length);  // add this
    console.log("faculty:", faculty);               // add this

    res.render("faculty/list", {
        title: "Faculty Directory",
        faculty,
        sortBy
    })
}


const facultyDetailPage = (req, res) => {

    const facultyId = req.params.facultyId

    const faculty = getFacultyById(facultyId)

    if (!faculty) {

        return res.status(404).send("Faculty not found")
    }

    res.render("faculty/detail", {
        title: faculty.name,
        faculty
    })
}


export {
    facultyListPage,
    facultyDetailPage
}