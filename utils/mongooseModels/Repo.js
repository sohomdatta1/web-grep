const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const RepoSchema = new Schema( {
  name: String,
  url: String,
  blurb: String,
  reIndexInterval: Number,
} );

const RepoModel = new mongoose.model( 'Repo', RepoSchema );

module.exports = RepoModel;
