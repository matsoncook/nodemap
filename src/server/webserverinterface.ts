export default class WebServerInterface
{
    makeAjaxCall(url: string, onSuccess: (data:string) => void): void {
        console.log("Ajax call: ", url);
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                
                return response.json(); // or response.text() if expecting plain text
            })
            .then(data => {
                console.log("Data received:", data);
                onSuccess(data)
            })
            .catch(error => {
                console.error("Error during fetch:", error);
            });
    }
}