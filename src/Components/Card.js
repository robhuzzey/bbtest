import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  card: {
    maxWidth: 500,
  },
  media: {
    height: 140,
  }
});

export default function MediaCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={`${process.env.PUBLIC_URL}/sprites/${props.id}.png`}
        title={props.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {props.name}
        </Typography>
        <ul>
          {Object.keys(props.attributes).map((attributeName, i) => {
            return (
              <li key={`attribute_${i}`}>
                <Button disabled={!props.isActive} onClick={() => props.chooseAttribute(attributeName)} size="small" color="primary">
                  {attributeName} ({props.isActive ? props.attributes[attributeName] : '...'})
                </Button>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  );
}