const jwt = require('jsonwebtoken');

class Import extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          file: "",
          table: ""
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
      }

    onChange(e) {
        this.setState({ file: e.target.value });
        console.log(e);
        console.log(this.state);
    }

    onSubmit(e) {
        e.preventDefault();
        console.log("submitted");
        // get form data out of state
        const { field, table } = this.state;
        const token = jwt.sign(process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
        console.log(token);

        // Below, this code could be used to call the route. It passes the variables and the authentication token
    
        // fetch('http://localhost:3000/api/import/User' , {
        //     method: "POST",
        //     headers: {
        //         'Content-type': 'application/json',
        //         'Authorization': 'Bearer ' + token,
        //     },
        //     body: JSON.stringify(this.state)
        //     })
        //     .then((result) => result.json())
        //     .then((info) => { console.log(info); })
    }
    render() {
        const { classes } = this.props;
        const { file } = this.state;
        return(
        <form onSubmit={this.onSubmit}> 
            {/* method="POST" action='http://localhost:3000/api/import/User'> */}
            <input label="File" id="input" type="file" name="file" accept=".csv" value={this.state.file} onChange={this.onChange} required></input>
            <br></br>
            <label htmlFor="table">Table: </label>
            <input id="table" type="text" name="table" defaultValue="" required></input>
            <br/>
            <input type="submit" value="Submit"/>
        </form>
        )
    }
}

export default Import