

const dateTransform = (date) => {
  let res = '';

  let month = date.slice(5, 7);
  let year = date.slice(0, 4);

  if (month === '01') {
    res = `Jan ${year}`;
  } else if (month === '02') {
    res = `Feb ${year}`;
  } else if (month === '03') {
    res = `Mar ${year}`;
  } else if (month === '04') {
    res = `Apr ${year}`;
  } else if (month === '05') {
    res = `May ${year}`;
  } else if (month === '06') {
    res = `Jun ${year}`;
  } else if (month === '07') {
    res = `Jul ${year}`;
  } else if (month === '08') {
    res = `Aug ${year}`;
  } else if (month === '09') {
    res = `Sep ${year}`;
  } else if (month === '10') {
    res = `Oct ${year}`;
  } else if (month === '11') {
    res = `Nov ${year}`;
  } else if (month === '12') {
    res = `Dec ${year}`;
  }

  return res;
}

export const sortReviews = (reviews) => {
  reviews.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    if (dateA > dateB) {
      return -1;
    }

    if (dateA < dateB) {
      return 1;
    }

    return 0;
  })
}

export default dateTransform;