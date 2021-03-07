const mongoose = require( 'mongoose' );
const RepoModel = require( '../mongooseModels/Repo' );
mongoose.connect( 'mongodb://localhost/web-grep' );

const SimpleGit = require( 'simple-git' );
