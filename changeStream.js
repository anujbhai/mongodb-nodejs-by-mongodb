function closeChangeStream(timeInMs = 6000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve()
        }, timeInMs);
    });
}
