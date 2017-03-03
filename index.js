process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

const parse = require('csv-parse/lib/sync');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const api = require('./shopify');

exports.processCsvBody = function(csvBody){
	var records = parse(csvBody, { 
		columns: true, 
		delimiter: ',',	
	});
	
	exports.processRecords(records);
};

exports.processRecords = function(records){		
	records.forEach(function(record){
		console.log(record);
	});
};

exports.handler = (event, context, callback) => {
    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
	
    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            console.log(message);
            callback(message);
        } else {
            console.log('CONTENT TYPE:', data.ContentType);
            console.log('Filename:', key);
            console.log('SAMPLETEST:', process.env.SAMPLETEST);
            console.log('Body:', data.Body.toString());
            exports.processCsvBody(data.Body.toString());

            callback(null, data.ContentType);
        }
    });

};
