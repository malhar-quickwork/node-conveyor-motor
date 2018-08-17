let router = express.Router();
let socketClient = io(ip.address+':'+CAM_PORT);
app.route('/api/cats').get((req,res) => {
    console.log('REQUEST');
    socketClient.emit('stop-motor');
    res.send(200,req);
});
module.exports = router;