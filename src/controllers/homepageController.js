let getHomepage = (req, res) => {
    return res.render("homepage.ejs");
};
let closebrowser =  (req, res) => {
    return res.redirect('https://www.messenger.com/closeWindow/?image_url=https://image.shutterstock.com/image-illustration/closing-down-rubber-stamp-over-260nw-142518553.jpg&display_text=halaclosingna');
};
module.exports = {
    getHomepage: getHomepage,
    closebrowser: closebrowser
};
